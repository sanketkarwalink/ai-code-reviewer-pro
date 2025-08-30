@echo off
REM 🚀 AI Code Reviewer Pro - Quick Setup Script (Windows)
REM This script helps you set up the project for development

echo 🤖 AI Code Reviewer Pro - Setup Script
echo =======================================

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node -v

REM Check if npm is installed
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ npm found:
npm -v

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Setting up environment variables...

if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo ✅ Created .env.local from .env.example
        echo ⚠️  Please add your OpenAI API key to .env.local
    ) else (
        echo # OpenAI API Key (Required^) > .env.local
        echo # Get from: https://platform.openai.com/api-keys >> .env.local
        echo OPENAI_API_KEY=your_openai_api_key_here >> .env.local
        echo. >> .env.local
        echo # Optional: Additional AI Providers >> .env.local
        echo # GROQ_API_KEY=your_groq_api_key_here >> .env.local
        echo # HUGGINGFACE_API_KEY=your_huggingface_token_here >> .env.local
        echo # COHERE_API_KEY=your_cohere_api_key_here >> .env.local
        echo ✅ Created .env.local with template
        echo ⚠️  Please add your OpenAI API key to .env.local
    )
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🔍 Running type check...
call npm run type-check

echo.
echo 🧹 Running linter...
call npm run lint

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Add your OpenAI API key to .env.local
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 Additional resources:
echo - README.md - Project documentation
echo - CONTRIBUTING.md - Contribution guidelines
echo - SETUP_FREE_AI.md - Free AI providers setup
echo.
echo Happy coding! 🚀
pause
