// Workers-compatible comments API handler
import { createClient } from '@supabase/supabase-js';

export async function handleComments(request, env) {
  try {
    const url = new URL(request.url);
    const method = request.method;
    
    // Initialize Supabase client
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    
    if (method === 'GET') {
      const blogSlug = url.searchParams.get('blog_slug');
      
      if (!blogSlug) {
        return new Response(JSON.stringify({ error: 'Blog slug is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Get approved comments for the blog post
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_slug', blogSlug)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Supabase error fetching comments:', error);
        
        // If table doesn't exist, return empty comments
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || 
            error.message.includes('relation "comments" does not exist')) {
          return new Response(JSON.stringify({ comments: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch comments', 
          details: error.message 
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      
      // Organize comments into tree structure
      const commentTree = organizeCommentsIntoTree(comments || []);
      
      return new Response(JSON.stringify({ comments: commentTree }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (method === 'POST') {
      const body = await request.json();
      const { blog_slug, parent_id, author_name, author_email, author_website, content } = body;
      
      // Validate required fields
      if (!blog_slug || !author_name || !author_email || !content) {
        return new Response(JSON.stringify({
          error: 'Missing required fields: blog_slug, author_name, author_email, content'
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(author_email)) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Get client IP
      const ipAddress = request.headers.get('cf-connecting-ip') || 
                       request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
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
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating comment:', error);
        
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || 
            error.message.includes('relation "comments" does not exist')) {
          return new Response(JSON.stringify({ 
            error: 'Comments system not set up yet',
            details: 'The comments database table needs to be created.',
            setup_required: true
          }), { status: 503, headers: { 'Content-Type': 'application/json' } });
        }
        
        return new Response(JSON.stringify({ 
          error: 'Failed to create comment',
          details: error.message
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      
      return new Response(JSON.stringify({ 
        message: 'Comment submitted successfully. It will be reviewed before being published.',
        comment: {
          id: comment.id,
          author_name: comment.author_name,
          content: comment.content,
          created_at: comment.created_at
        }
      }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in comments API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to organize comments into tree structure
function organizeCommentsIntoTree(comments) {
  const commentMap = new Map();
  const rootComments = [];
  
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
