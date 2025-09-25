#!/bin/bash

# Cloudflare Pages Deployment Script for Paras Digital Portfolio
# This script helps prepare your project for Cloudflare Pages deployment

echo "🚀 Paras Digital - Cloudflare Pages Deployment Setup"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from template..."
    cp env.example .env.local
    echo "📝 Please update .env.local with your actual credentials before deploying."
    echo "   Required variables:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - NOTION_API_KEY"
    echo "   - NOTION_DATABASE_ID"
    echo "   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO"
    echo "   - CONTACT_TABLE_NAME"
    echo "   - REVALIDATE_SECRET"
else
    echo "✅ .env.local file found"
fi

# Test build
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check your configuration and try again."
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your project is ready for Cloudflare Pages deployment."
echo ""
echo "Next steps:"
echo "1. Go to https://dash.cloudflare.com/"
echo "2. Navigate to Pages → Create a project"
echo "3. Connect your GitHub repository"
echo "4. Use these build settings:"
echo "   - Framework preset: Next.js"
echo "   - Build command: npm run build"
echo "   - Build output directory: .next"
echo "   - Node.js version: 18"
echo "5. Add all environment variables from .env.local"
echo "6. Deploy!"
echo ""
echo "📖 For detailed instructions, see CLOUDFLARE_DEPLOYMENT.md"
echo "🌐 Your site will be available at: https://your-project-name.pages.dev"
