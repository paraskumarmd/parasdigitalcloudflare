// Workers-compatible comments moderation API handler
import { createClient } from '@supabase/supabase-js';

export async function handleCommentsModerate(request, env) {
  try {
    const url = new URL(request.url);
    const method = request.method;
    
    // Initialize Supabase client
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    
    if (method === 'GET') {
      const status = url.searchParams.get('status') || 'pending';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;
      
      // Get comments for moderation
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) {
        console.error('Error fetching comments for moderation:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      
      if (countError) {
        console.error('Error fetching comment count:', countError);
      }
      
      return new Response(JSON.stringify({ 
        comments: comments || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    if (method === 'POST') {
      const body = await request.json();
      const { commentIds, action } = body;
      
      if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
        return new Response(JSON.stringify({ error: 'Comment IDs are required' }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (!action || !['approve', 'reject', 'spam', 'delete'].includes(action)) {
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (action === 'delete') {
        // Delete comments
        const { error } = await supabase
          .from('comments')
          .delete()
          .in('id', commentIds);
        
        if (error) {
          console.error('Error deleting comments:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete comments' }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({ 
          message: `${commentIds.length} comment(s) deleted successfully` 
        }), { headers: { 'Content-Type': 'application/json' } });
      } else {
        // Update comment status
        const statusMap = {
          approve: 'approved',
          reject: 'rejected',
          spam: 'spam'
        };
        
        const status = statusMap[action];
        const updateData = { status };
        
        if (status === 'approved') {
          updateData.approved_at = new Date().toISOString();
        }
        
        const { error } = await supabase
          .from('comments')
          .update(updateData)
          .in('id', commentIds);
        
        if (error) {
          console.error('Error updating comments:', error);
          return new Response(JSON.stringify({ error: 'Failed to update comments' }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({ 
          message: `${commentIds.length} comment(s) ${action}d successfully` 
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in comments moderate API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
