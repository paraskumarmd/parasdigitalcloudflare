# Quick Setup Guide for Comments System

## 🚨 The Error You're Seeing

The "Failed to fetch comments" error occurs because the `comments` table doesn't exist in your Supabase database yet.

## ✅ Quick Fix (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### Step 2: Run the SQL Setup
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the entire contents of `comments-setup.sql` into the editor
4. Click **"Run"** to execute the script

### Step 3: Test the Setup
1. Visit your blog post page
2. The comments section should now load without errors
3. You can test by submitting a comment

## 🔧 Alternative: Test Database Connection

Visit this URL to test if the table exists:
```
http://localhost:3000/api/test-comments
```

**Expected responses:**
- ✅ `"table_exists": true` - Setup complete
- ❌ `"setup_required": true` - Need to run SQL script

## 📋 What the SQL Script Creates

- `comments` table with all necessary fields
- Indexes for better performance
- Row Level Security (RLS) policies
- Automatic timestamp updates
- Nested comment support (replies)

## 🎯 After Setup

Once the table is created:
- Comments will load properly on blog posts
- Visitors can submit comments
- You can moderate comments at `/admin/comments`
- All features will work as expected

## 🆘 Still Having Issues?

If you're still seeing errors after running the SQL script:

1. **Check Environment Variables** - Make sure these are set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. **Check Supabase Project** - Ensure you're running the script in the correct project

3. **Check Permissions** - Make sure your service role key has the right permissions

The commenting system is fully built and ready - it just needs the database table to be created! 🚀
