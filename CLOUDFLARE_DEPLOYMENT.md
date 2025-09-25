# Cloudflare Pages Deployment Guide

This guide will walk you through deploying your Paras Digital portfolio to Cloudflare Pages.

## 🚀 Quick Start

### Prerequisites
- GitHub repository with your code
- Cloudflare account (free)
- Environment variables ready

### Step 1: Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com) and sign up
2. Verify your email address
3. Complete the onboarding process

### Step 2: Connect Your Repository
1. In Cloudflare dashboard, go to **Pages** → **Create a project**
2. Choose **Connect to Git**
3. Select your GitHub repository: `parasdigitalCloudflare/parasdigtital`
4. Click **Begin setup**

### Step 3: Configure Build Settings
Use these exact settings:

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: / (leave empty)
Node.js version: 18
```

### Step 4: Environment Variables
Add all these environment variables in Cloudflare Pages:

#### Required Variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Notion API Configuration
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=paraskumar.desh@gmail.com

# Database Table Name
CONTACT_TABLE_NAME=contact_submissions

# Revalidation Secret (for content updates)
REVALIDATE_SECRET=your_super_secret_key_here
```

### Step 5: Deploy
1. Click **Save and Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be available at: `https://your-project-name.pages.dev`

## 🔧 Advanced Configuration

### Custom Domain Setup
1. In Cloudflare Pages dashboard, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `parasdigital.com`)
4. Follow DNS configuration instructions
5. Enable **Always Use HTTPS**

### Performance Optimizations
Your Next.js config is already optimized for Cloudflare Pages with:
- Standalone output for better performance
- Image optimization enabled
- Compression enabled
- Bundle splitting for optimal loading

### Security Headers
The `wrangler.toml` file includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📊 Monitoring & Analytics

### Cloudflare Analytics
- Built-in analytics in Cloudflare dashboard
- Real-time visitor data
- Performance metrics
- Security insights

### Custom Analytics
Your app includes:
- Vercel Analytics (can be replaced with Cloudflare Analytics)
- Speed Insights for performance monitoring

## 🔄 Content Updates

### Automatic Updates
- Every push to your main branch triggers a new deployment
- Preview deployments for pull requests

### Manual Content Revalidation
After updating Notion content, trigger revalidation:
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_super_secret_key_here","path":"/blog"}'
```

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
1. **Node.js version**: Ensure using Node.js 18
2. **Dependencies**: Check if all packages are compatible
3. **Environment variables**: Verify all required variables are set

#### Runtime Errors
1. **API routes not working**: Check environment variables
2. **Database connection**: Verify Supabase credentials
3. **Email sending**: Check SMTP configuration

#### Performance Issues
1. **Slow loading**: Check image optimization settings
2. **Large bundle**: Review webpack configuration
3. **Cache issues**: Clear Cloudflare cache

### Debug Mode
Enable debug mode by adding to environment variables:
```env
DEBUG=true
NODE_ENV=development
```

## 📈 Scaling & Limits

### Cloudflare Pages Free Tier
- **Builds**: 500 builds/month
- **Bandwidth**: Unlimited
- **Requests**: Unlimited
- **Custom domains**: Unlimited
- **Build time**: 20 minutes per build

### Upgrade Options
- **Pro**: $20/month for more builds and features
- **Business**: $200/month for advanced features
- **Enterprise**: Custom pricing

## 🔒 Security Best Practices

### Environment Variables
- Never commit sensitive data to Git
- Use Cloudflare's secure environment variable storage
- Rotate secrets regularly

### API Security
- Implement rate limiting for API routes
- Validate all inputs
- Use HTTPS everywhere

### Database Security
- Enable Row Level Security (RLS) in Supabase
- Use service role key only for server-side operations
- Regular security audits

## 🚀 Go Live Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured correctly
- [ ] All environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Contact form tested
- [ ] Blog content loading correctly
- [ ] Performance optimized
- [ ] Analytics configured
- [ ] Backup strategy in place

## 📞 Support

### Cloudflare Support
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- [Status Page](https://www.cloudflarestatus.com/)

### Project Support
- Check GitHub issues
- Review documentation
- Contact: paraskumar.desh@gmail.com

---

**🎉 Congratulations! Your Paras Digital portfolio is now live on Cloudflare Pages!**

Benefits you're getting:
- ✅ Global CDN for fast loading worldwide
- ✅ Automatic HTTPS and security
- ✅ Free hosting with generous limits
- ✅ Git-based deployments
- ✅ Preview deployments for testing
- ✅ Built-in analytics and monitoring
