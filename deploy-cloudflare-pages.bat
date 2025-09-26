@echo off
REM Deploy Paras Digital Portfolio to Cloudflare Pages
echo 🚀 Deploying Paras Digital Portfolio to Cloudflare Pages...

REM Build the application
echo 📦 Building Next.js application...
npm run build

REM Export static files
echo 📤 Exporting static files...
npm run export

REM Deploy to Cloudflare Pages
echo ☁️ Deploying to Cloudflare Pages...
npx wrangler pages deploy out --project-name parasdigicloudflare

echo ✅ Deployment complete!
echo 🌐 Your site should be available at: https://parasdigicloudflare.pages.dev
pause
