@echo off
REM Cloudflare Pages Deployment Script for Paras Digital Portfolio
REM This script helps prepare your project for Cloudflare Pages deployment

echo 🚀 Paras Digital - Cloudflare Pages Deployment Setup
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  .env.local file not found. Creating from template...
    copy env.example .env.local
    echo 📝 Please update .env.local with your actual credentials before deploying.
    echo    Required variables:
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo    - SUPABASE_SERVICE_ROLE_KEY
    echo    - NOTION_API_KEY
    echo    - NOTION_DATABASE_ID
    echo    - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO
    echo    - CONTACT_TABLE_NAME
    echo    - REVALIDATE_SECRET
) else (
    echo ✅ .env.local file found
)

REM Test build
echo 🔨 Testing build process...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed. Please check your configuration and try again.
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! Your project is ready for Cloudflare Pages deployment.
echo.
echo Next steps:
echo 1. Go to https://dash.cloudflare.com/
echo 2. Navigate to Pages → Create a project
echo 3. Connect your GitHub repository
echo 4. Use these build settings:
echo    - Framework preset: Next.js
echo    - Build command: npm run build
echo    - Build output directory: .next
echo    - Node.js version: 18
echo 5. Add all environment variables from .env.local
echo 6. Deploy!
echo.
echo 📖 For detailed instructions, see CLOUDFLARE_DEPLOYMENT.md
echo 🌐 Your site will be available at: https://your-project-name.pages.dev

pause
