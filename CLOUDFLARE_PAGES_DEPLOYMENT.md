# Cloudflare Pages Deployment Guide

## Current Status
✅ **Local Development**: Working on http://localhost:3000
✅ **Build**: Successful with all pages generated
✅ **Configuration**: Updated for Cloudflare Pages

## Deployment Options

### Option 1: Manual Deployment via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**:
   - Visit: https://dash.cloudflare.com/
   - Navigate to "Pages" in the sidebar

2. **Create New Project**:
   - Click "Create a project"
   - Connect your GitHub repository: `parasdigitalCloudflare/parasdigtital`

3. **Configure Build Settings**:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)

4. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://qkokgwunjnlhssuntiob.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb2tnd3Vuam5saHNzdW50aW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxOTY5NDYsImV4cCI6MjA3MDc3Mjk0Nn0.RDJzFkY7v_X9EEt2LsyH1dKz-UhSPp9-FuDUMk1xnuo
   CONTACT_TABLE_NAME = contact_submissions
   ```

5. **Set Secrets** (in Cloudflare Dashboard):
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_TO`

### Option 2: Command Line Deployment (If OAuth Works)

```bash
# Install wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy .next --project-name parasdigicloudflare
```

### Option 3: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: parasdigicloudflare
          directory: .next
```

## Current Configuration Files

- ✅ `wrangler.toml`: Updated for Pages
- ✅ `next.config.js`: Configured for hybrid rendering
- ✅ `package.json`: Build scripts ready

## Next Steps

1. **Choose deployment method** (Dashboard recommended)
2. **Set up environment variables** in Cloudflare
3. **Deploy and test** your live site
4. **Configure custom domain** if needed

Your application is ready for deployment! 🚀
