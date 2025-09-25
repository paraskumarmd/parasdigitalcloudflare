# Contact Form Setup Guide

This guide explains how to set up the contact form with email notifications and Supabase database storage.

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Email Service**: Gmail, Outlook, or any SMTP service
3. **Environment Variables**: Set up your configuration

## Step 1: Supabase Setup

1. **Create a new Supabase project**
2. **Get your project credentials**:
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (keep this secret!)

3. **Set up the database table**:
   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL script from `supabase-setup.sql`

## Step 2: Email Service Setup

### For Gmail:
1. Enable 2-factor authentication
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in your environment variables

### For other SMTP services:
- Update the `EMAIL_HOST`, `EMAIL_PORT`, and credentials accordingly

## Step 3: Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=paraskumar.desh@gmail.com

# Database Table Name
CONTACT_TABLE_NAME=contact_submissions
```

## Step 4: Test the Form

1. Start your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check:
   - Supabase dashboard for the new record
   - Your email for the notification

## Troubleshooting

### Common Issues:

1. **"Failed to store submission"**:
   - Check Supabase credentials
   - Verify table exists and permissions are correct

2. **"Email sending failed"**:
   - Verify SMTP credentials
   - Check if 2FA is enabled for Gmail
   - Ensure app password is correct

3. **Environment variables not loading**:
   - Restart your development server
   - Check `.env.local` file location

### Security Notes:

- Never commit `.env.local` to version control
- Use environment variables in production
- Consider rate limiting for production use
- Validate and sanitize all form inputs

## Production Deployment

1. **Set environment variables** in your hosting platform
2. **Enable Row Level Security** in Supabase
3. **Set up proper CORS** if needed
4. **Consider adding rate limiting** to prevent spam
5. **Set up monitoring** for form submissions

## Features

✅ **Form validation** (client and server-side)
✅ **Database storage** in Supabase
✅ **Email notifications** via SMTP
✅ **Error handling** and user feedback
✅ **Security** with input validation
✅ **Responsive design** with animations
