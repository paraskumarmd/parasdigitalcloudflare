// Workers-compatible comments by ID API handler
import { createClient } from '@supabase/supabase-js';

export async function handleCommentsById(request, env, commentId) {
  try {
    const method = request.method;
    
    // Initialize Supabase client
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    
    if (method === 'PUT') {
      const body = await request.json();
      const { status } = body;
      
      if (!status || !['pending', 'approved', 'rejected', 'spam'].includes(status)) {
        return new Response(JSON.stringify({ error: 'Invalid status' }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Update comment status
      const { data: comment, error } = await supabase
        .from('comments')
        .update({ 
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', commentId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating comment:', error);
        return new Response(JSON.stringify({ error: 'Failed to update comment' }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        message: 'Comment status updated successfully',
        comment 
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    if (method === 'DELETE') {
      // Delete comment (this will also delete replies due to CASCADE)
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      
      if (error) {
        console.error('Error deleting comment:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete comment' }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        message: 'Comment deleted successfully' 
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in comments by ID API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
