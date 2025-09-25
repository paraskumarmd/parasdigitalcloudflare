import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('blog_slug');
    
    console.log('GET /api/comments called with blog_slug:', blogSlug);
    
    if (!blogSlug) {
      return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Get approved comments for the blog post
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_slug', blogSlug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error fetching comments:', error);
      
      // If the table doesn't exist, return empty comments instead of error
      if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message.includes('relation "comments" does not exist') || error.message.includes('Could not find the table')) {
        console.log('Comments table does not exist yet, returning empty array');
        return NextResponse.json({ comments: [] });
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch comments', 
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }

    console.log('Comments fetched successfully:', comments?.length || 0, 'comments');

    // Organize comments into a tree structure
    const commentTree = organizeCommentsIntoTree(comments || []);

    return NextResponse.json({ comments: commentTree });
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blog_slug, parent_id, author_name, author_email, author_website, content } = body;

    // Validate required fields
    if (!blog_slug || !author_name || !author_email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: blog_slug, author_name, author_email, content' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Get client IP and user agent
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const supabase = createServerSupabaseClient();

    // Insert the comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        blog_slug,
        parent_id: parent_id || null,
        author_name: author_name.trim(),
        author_email: author_email.trim().toLowerCase(),
        author_website: author_website?.trim() || null,
        content: content.trim(),
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'pending' // Comments start as pending for moderation
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      
      // If the table doesn't exist, return a helpful message
      if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message.includes('relation "comments" does not exist') || error.message.includes('Could not find the table')) {
        return NextResponse.json({ 
          error: 'Comments system not set up yet',
          details: 'The comments database table needs to be created. Please run the SQL setup script in your Supabase dashboard.',
          setup_required: true
        }, { status: 503 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to create comment',
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Comment submitted successfully. It will be reviewed before being published.',
      comment: {
        id: comment.id,
        author_name: comment.author_name,
        content: comment.content,
        created_at: comment.created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to organize comments into a tree structure
function organizeCommentsIntoTree(comments: any[]) {
  const commentMap = new Map();
  const rootComments: any[] = [];

  // First pass: create a map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, {
      ...comment,
      replies: []
    });
  });

  // Second pass: organize into tree structure
  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies.push(commentMap.get(comment.id));
      }
    } else {
      rootComments.push(commentMap.get(comment.id));
    }
  });

  return rootComments;
}
