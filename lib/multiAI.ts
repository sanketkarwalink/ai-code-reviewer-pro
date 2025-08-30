import { OpenAI } from 'openai';
import { HfInference } from '@huggingface/inference';

// Provider configuration
interface AIProvider {
  name: string;
  enabled: boolean;
  apiKey?: string;
  model: string;
  maxTokens: number;
  requestsPerMinute: number;
  lastUsed: number;
  requestCount: number;
}

class MultiAIService {
  private providers: AIProvider[] = [
    {
      name: 'openai',
      enabled: !!process.env.OPENAI_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      maxTokens: 4000,
      requestsPerMinute: 60,
      lastUsed: 0,
      requestCount: 0
    },
    {
      name: 'huggingface',
      enabled: false, // Temporarily disabled due to model issues
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: 'HuggingFaceH4/zephyr-7b-beta',
      maxTokens: 1000,
      requestsPerMinute: 100,
      lastUsed: 0,
      requestCount: 0
    }
  ];

  private clients: any = {};

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    // Initialize OpenAI
    if (this.providers.find(p => p.name === 'openai')?.enabled) {
      this.clients.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Hugging Face
    if (this.providers.find(p => p.name === 'huggingface')?.enabled) {
      this.clients.huggingface = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }
  }

  // Get the best available provider
  private getNextProvider(): AIProvider | null {
    const now = Date.now();
    const availableProviders = this.providers.filter(p => {
      if (!p.enabled) return false;
      
      // Reset counter if more than a minute has passed
      if (now - p.lastUsed > 60000) {
        p.requestCount = 0;
      }
      
      return p.requestCount < p.requestsPerMinute;
    });

    if (availableProviders.length === 0) {
      return null;
    }

    // Sort by usage (least used first) and last used time
    availableProviders.sort((a, b) => {
      if (a.requestCount !== b.requestCount) {
        return a.requestCount - b.requestCount;
      }
      return a.lastUsed - b.lastUsed;
    });

    return availableProviders[0];
  }

  // Generic completion method
  async complete(prompt: string, systemPrompt?: string): Promise<{ content: string; provider: string }> {
    const provider = this.getNextProvider();
    
    if (!provider) {
      throw new Error('No available AI providers. Please check your API keys.');
    }

    provider.requestCount++;
    provider.lastUsed = Date.now();

    console.log(`Using AI provider: ${provider.name} (${provider.requestCount}/${provider.requestsPerMinute})`);

    try {
      let response: string;

      switch (provider.name) {
        case 'openai':
          response = await this.callOpenAI(prompt, provider, systemPrompt);
          break;
        case 'huggingface':
          response = await this.callHuggingFace(prompt, provider, systemPrompt);
          break;
        default:
          throw new Error(`Unknown provider: ${provider.name}`);
      }

      return {
        content: response,
        provider: provider.name
      };
    } catch (error: any) {
      console.error(`Error with ${provider.name}:`, error);
      
      // Only disable provider for specific errors, not for timeouts or network issues
      if (error.message?.includes('API key') || error.message?.includes('authentication') || error.message?.includes('No Inference Provider')) {
        console.log(`${provider.name} disabled due to authentication/API issue`);
        provider.enabled = false;
        setTimeout(() => {
          provider.enabled = !!provider.apiKey;
        }, 60000); // Re-enable after 1 minute
      } else {
        console.log(`${provider.name} had a temporary error (timeout/network), keeping enabled`);
        // Don't disable for timeouts or network errors, just re-throw
      }
      
      throw error; // Re-throw the error
    }
  }

  private async callOpenAI(prompt: string, provider: AIProvider, systemPrompt?: string): Promise<string> {
    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.clients.openai.chat.completions.create({
      model: provider.model,
      messages,
      max_tokens: provider.maxTokens,
      temperature: 0.1,
    });

    return response.choices[0]?.message?.content || '';
  }

  private async callHuggingFace(prompt: string, provider: AIProvider, systemPrompt?: string): Promise<string> {
    // Combine system prompt with user prompt for Hugging Face
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}\nAssistant:` : prompt;
    
    try {
      const response = await this.clients.huggingface.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: provider.maxTokens,
          temperature: 0.1,
          do_sample: true,
          return_full_text: false,
          stop: ['User:', '\n\n']
        }
      });

      return response.generated_text || '';
    } catch (error: any) {
      console.error('Hugging Face error:', error);
      // If the model fails, try a simpler approach
      if (error.message?.includes('No Inference Provider available')) {
        throw new Error('Hugging Face model temporarily unavailable');
      }
      throw error;
    }
  }

  // Get provider status
  getProviderStatus() {
    return this.providers.map(p => ({
      name: p.name,
      enabled: p.enabled,
      hasApiKey: !!p.apiKey,
      requestCount: p.requestCount,
      requestsPerMinute: p.requestsPerMinute,
      lastUsed: p.lastUsed
    }));
  }

  // Method to re-enable all providers (useful for recovery)
  resetProviders() {
    this.providers.forEach(p => {
      if (p.apiKey) {
        p.enabled = true;
        p.requestCount = 0;
        p.lastUsed = 0;
      }
    });
    console.log('All providers with API keys have been re-enabled');
  }
}

export const multiAI = new MultiAIService();
