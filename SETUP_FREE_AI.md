# 🤖 Free AI Providers Setup Guide

This guide helps you set up multiple free AI providers for unlimited code reviews!

## 🎯 Quick Setup Checklist

### ✅ Already Working
- **OpenAI** - You have free credits

### 🚀 Add These Free Providers

#### 1. **Groq** (HIGHLY RECOMMENDED)
- **Free Tier**: 6,000 tokens/minute
- **Models**: llama-3.1-70b (excellent for code)
- **Setup**: 
  1. Go to https://console.groq.com/
  2. Sign up with email (free)
  3. Create API key
  4. Add to `.env.local`: `GROQ_API_KEY=your_key_here`

#### 2. **Hugging Face** 
- **Free Tier**: Unlimited inference on public models
- **Models**: Various open-source models
- **Setup**:
  1. Go to https://huggingface.co/settings/tokens
  2. Create account & generate token
  3. Add to `.env.local`: `HUGGINGFACE_API_KEY=your_token_here`

#### 3. **Cohere**
- **Free Tier**: 1,000 calls/month
- **Models**: Command (good for code analysis)
- **Setup**:
  1. Go to https://dashboard.cohere.ai/
  2. Sign up for free account
  3. Get API key
  4. Add to `.env.local`: `COHERE_API_KEY=your_key_here`

## 🛠️ Complete .env.local Example

```bash
# Copy this to your .env.local file
OPENAI_API_KEY=sk-your-openai-key-here
GROQ_API_KEY=gsk_your-groq-key-here
HUGGINGFACE_API_KEY=hf_your-huggingface-token-here
COHERE_API_KEY=your-cohere-key-here
```

## 🔄 How Multi-Provider Works

1. **Auto-Rotation**: System automatically switches between providers
2. **Rate Limit Smart**: Tracks usage per provider to avoid limits
3. **Fallback**: If one fails, tries the next available provider
4. **Free Forever**: Combine multiple free tiers for unlimited usage

## 📊 Provider Comparison

| Provider | Quality | Speed | Free Limit | Best For |
|----------|---------|-------|------------|----------|
| **OpenAI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $5 credits | Premium analysis |
| **Groq** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 6K tokens/min | Fast responses |
| **Hugging Face** | ⭐⭐⭐ | ⭐⭐⭐ | Unlimited | Open models |
| **Cohere** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 1K calls/month | General use |

## 🎉 Benefits of Multi-Provider Setup

- **💰 Cost**: Completely free with multiple providers
- **🚀 Speed**: Fast providers like Groq for quick analysis  
- **🔄 Reliability**: Automatic failover if one provider is down
- **📈 Scale**: Combined rate limits = more usage
- **🔒 Privacy**: Distribute requests across providers

## 🚨 Troubleshooting

### No Providers Available
```bash
# Check your .env.local file exists
# Restart your dev server after adding keys
npm run dev
```

### Provider Not Working
- Check the "Providers" tab in the app
- Verify API key format
- Check provider status page

## 🏁 Next Steps

1. Add at least **Groq** (fastest setup, best free tier)
2. Check the **Providers** tab to see status
3. Test code analysis - system will auto-select best provider
4. Monitor usage in **Analytics** tab

Your app will now intelligently switch between providers for unlimited free code reviews! 🎉
