# Blog Comments System Setup

This document explains how to set up the commenting system for your blog.

## Database Setup

1. **Run the SQL setup script** in your Supabase database:
   ```sql
   -- Copy and paste the contents of comments-setup.sql into your Supabase SQL editor
   ```

2. **Environment Variables** - Make sure you have these in your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

## Features

### For Visitors
- **Leave Comments**: Visitors can comment on blog posts
- **Reply to Comments**: Nested comment system with replies
- **Comment Form**: Clean, accessible form with validation
- **Real-time Updates**: Comments refresh automatically
- **Moderation Notice**: Users are informed that comments are moderated

### For Administrators
- **Comment Moderation Dashboard**: `/admin/comments`
- **Bulk Actions**: Approve, reject, mark as spam, or delete multiple comments
- **Status Management**: Comments start as "pending" and require approval
- **Comment Details**: View author info, IP address, timestamps
- **Filtering**: View comments by status (pending, approved, rejected, spam)

## Comment Status Flow

1. **Pending**: New comments start here (default)
2. **Approved**: Moderated and visible to visitors
3. **Rejected**: Moderated but not approved
4. **Spam**: Marked as spam for filtering

## API Endpoints

### Public Endpoints
- `GET /api/comments?blog_slug=slug` - Get approved comments for a blog post
- `POST /api/comments` - Submit a new comment

### Admin Endpoints
- `GET /api/comments/moderate?status=pending&page=1` - Get comments for moderation
- `POST /api/comments/moderate` - Bulk actions on comments
- `PUT /api/comments/[id]` - Update individual comment status
- `DELETE /api/comments/[id]` - Delete individual comment

## Security Features

- **IP Tracking**: Comments are tracked by IP address
- **User Agent Logging**: Browser information is logged
- **Email Validation**: Email addresses are validated
- **Content Validation**: Comments must be at least 10 characters
- **Rate Limiting**: Built-in protection against spam
- **Moderation Required**: All comments require approval before being public

## Customization

### Styling
The comment components use your existing UI components and can be customized by modifying:
- `components/comments/CommentForm.tsx`
- `components/comments/CommentList.tsx`
- `components/comments/CommentItem.tsx`

### Validation
Comment validation rules can be modified in `components/comments/CommentForm.tsx`:
```typescript
const commentSchema = z.object({
  author_name: z.string().min(2, 'Name must be at least 2 characters'),
  author_email: z.string().email('Please enter a valid email address'),
  author_website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  content: z.string().min(10, 'Comment must be at least 10 characters'),
});
```

## Usage

### For Blog Posts
Comments are automatically integrated into blog post pages at `/blog/[slug]`. The comment system will:
- Display existing approved comments
- Allow visitors to leave new comments
- Show replies in a nested structure
- Refresh automatically when new comments are approved

### For Moderation
Visit `/admin/comments` to:
- View pending comments requiring approval
- Bulk approve, reject, or delete comments
- Filter comments by status
- View detailed comment information

## Troubleshooting

### Comments Not Appearing
1. Check that comments are approved in the admin dashboard
2. Verify the blog slug matches exactly
3. Check browser console for API errors

### Database Issues
1. Ensure the comments table exists in Supabase
2. Check RLS policies are properly configured
3. Verify environment variables are set correctly

### Styling Issues
1. Ensure all UI components are properly imported
2. Check that Tailwind CSS is configured correctly
3. Verify component dependencies are installed

## Future Enhancements

Potential improvements you could add:
- Email notifications for new comments
- Comment voting/likes system
- Rich text editor for comments
- Comment search functionality
- Automated spam detection
- Comment analytics dashboard
- Social media integration
- Comment threading improvements
