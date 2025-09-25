# 🚀 Quick Comments Setup (2 minutes)

## The Issue
You're seeing "Failed to create comment" because the comments database table doesn't exist yet.

## ✅ Quick Fix

### Step 1: Open Supabase
1. Go to [supabase.com](https://supabase.com)
2. Sign in → Select your project

### Step 2: Create the Table
1. Click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `comments-setup.sql`
4. Paste into the editor
5. Click **"Run"** ✅

### Step 3: Test
1. Go to any blog post
2. Try submitting a comment
3. It should work! 🎉

## 📋 What Gets Created
- `comments` table with all fields
- Security policies
- Indexes for performance
- Nested comment support

## 🎯 After Setup
- ✅ Comments work on all blog posts
- ✅ Admin moderation at `/admin/comments`
- ✅ Email validation & spam protection
- ✅ Nested replies

**That's it!** The commenting system is fully built - it just needs this one database table created.
