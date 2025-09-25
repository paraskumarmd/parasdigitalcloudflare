import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Required for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Test the connection by checking if we can access the database
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Database connection test failed'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: data
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
