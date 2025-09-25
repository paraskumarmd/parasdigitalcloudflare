import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = createServerSupabaseClient();

    // Get comments for moderation
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching comments for moderation:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (countError) {
      console.error('Error fetching comment count:', countError);
    }

    return NextResponse.json({ 
      comments: comments || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /api/comments/moderate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentIds, action } = body;

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json({ error: 'Comment IDs are required' }, { status: 400 });
    }

    if (!action || !['approve', 'reject', 'spam', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    if (action === 'delete') {
      // Delete comments
      const { error } = await supabase
        .from('comments')
        .delete()
        .in('id', commentIds);

      if (error) {
        console.error('Error deleting comments:', error);
        return NextResponse.json({ error: 'Failed to delete comments' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: `${commentIds.length} comment(s) deleted successfully` 
      });
    } else {
      // Update comment status
      const statusMap = {
        approve: 'approved',
        reject: 'rejected',
        spam: 'spam'
      };

      const status = statusMap[action as keyof typeof statusMap];
      const updateData: any = { status };

      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('comments')
        .update(updateData)
        .in('id', commentIds);

      if (error) {
        console.error('Error updating comments:', error);
        return NextResponse.json({ error: 'Failed to update comments' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: `${commentIds.length} comment(s) ${action}d successfully` 
      });
    }
  } catch (error) {
    console.error('Error in POST /api/comments/moderate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
