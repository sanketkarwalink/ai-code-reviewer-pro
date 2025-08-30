# 🚀 Deployment Guide

## Quick Deploy Options

### 1. **Vercel (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-code-reviewer-pro)

1. Click the button above
2. Import your GitHub repository
3. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Deploy!

### 2. **Netlify**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `out`
4. Add environment variables in Netlify dashboard

### 3. **Manual Deployment**
```bash
# Build the project
npm run build

# Start production server
npm start
```

## Environment Variables

Set these in your deployment platform:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key for code analysis |
| `GROQ_API_KEY` | ❌ | Groq API key (optional) |
| `HUGGINGFACE_API_KEY` | ❌ | Hugging Face token (optional) |
| `COHERE_API_KEY` | ❌ | Cohere API key (optional) |

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Performance Optimization

The app is optimized for production with:
- ✅ Turbopack for fast builds
- ✅ Code splitting and lazy loading
- ✅ Image optimization
- ✅ Font optimization
- ✅ Bundle analysis

## Domain Setup

1. **Custom Domain**: Configure in your deployment platform
2. **SSL**: Automatically handled by Vercel/Netlify
3. **CDN**: Built-in with modern hosting platforms

## Monitoring

Consider adding:
- **Analytics**: Google Analytics, Plausible
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Vercel Analytics, New Relic
