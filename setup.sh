#!/bin/bash

# 🚀 AI Code Reviewer Pro - Quick Setup Script
# This script helps you set up the project for development

set -e

echo "🤖 AI Code Reviewer Pro - Setup Script"
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please update Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm $(npm -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment file
echo ""
echo "🔧 Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
        echo "⚠️  Please add your OpenAI API key to .env.local"
    else
        cat > .env.local << EOF
# OpenAI API Key (Required)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Additional AI Providers
# GROQ_API_KEY=your_groq_api_key_here
# HUGGINGFACE_API_KEY=your_huggingface_token_here
# COHERE_API_KEY=your_cohere_api_key_here
EOF
        echo "✅ Created .env.local with template"
        echo "⚠️  Please add your OpenAI API key to .env.local"
    fi
else
    echo "✅ .env.local already exists"
fi

# Run type check
echo ""
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo ""
echo "🧹 Running linter..."
npm run lint

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Additional resources:"
echo "- README.md - Project documentation"
echo "- CONTRIBUTING.md - Contribution guidelines"
echo "- SETUP_FREE_AI.md - Free AI providers setup"
echo ""
echo "Happy coding! 🚀"
