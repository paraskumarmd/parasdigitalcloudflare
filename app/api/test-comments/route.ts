import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Test if the comments table exists
    const { data, error } = await supabase
      .from('comments')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation "comments" does not exist')) {
        return NextResponse.json({
          status: 'table_not_exists',
          message: 'Comments table does not exist. Please run the SQL setup script.',
          error: error.message,
          setup_required: true
        });
      }
      
      return NextResponse.json({
        status: 'error',
        message: 'Database connection error',
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Comments table exists and is accessible',
      table_exists: true
    });

  } catch (error) {
    console.error('Error testing comments table:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
