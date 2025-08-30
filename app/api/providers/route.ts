import { NextRequest, NextResponse } from 'next/server';
import { multiAI } from '../../../lib/multiAI';

export async function GET(request: NextRequest) {
  try {
    const status = multiAI.getProviderStatus();
    
    return NextResponse.json({
      providers: status,
      totalEnabled: status.filter(p => p.enabled && p.hasApiKey).length,
      availableProviders: [
        {
          name: "openai",
          description: "OpenAI GPT models - currently active",
          status: status.find(p => p.name === 'openai')?.hasApiKey ? 'active' : 'missing',
          setupInstructions: "Already configured"
        }
      ],
      additionalProviders: [
        {
          name: "groq",
          description: "Fast inference, 6,000 tokens/minute free",
          signupUrl: "https://console.groq.com/",
          envVar: "GROQ_API_KEY",
          priority: 1,
          setup: "1. Sign up at console.groq.com\n2. Create API key\n3. Add GROQ_API_KEY to .env.local"
        },
        {
          name: "huggingface",
          description: "Free inference API for open models",
          signupUrl: "https://huggingface.co/settings/tokens",
          envVar: "HUGGINGFACE_API_KEY",
          priority: 2,
          setup: "1. Create account at huggingface.co\n2. Go to Settings > Tokens\n3. Create new token\n4. Add HUGGINGFACE_API_KEY to .env.local"
        },
        {
          name: "cohere",
          description: "1000 free calls/month",
          signupUrl: "https://dashboard.cohere.ai/",
          envVar: "COHERE_API_KEY",
          priority: 3,
          setup: "1. Sign up at dashboard.cohere.ai\n2. Get API key\n3. Add COHERE_API_KEY to .env.local"
        }
      ]
    });
  } catch (error) {
    console.error('Provider status error:', error);
    return NextResponse.json(
      { error: 'Failed to get provider status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'reset') {
      multiAI.resetProviders();
      return NextResponse.json({ success: true, message: 'Providers reset successfully' });
    }
    
    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Provider action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
}
