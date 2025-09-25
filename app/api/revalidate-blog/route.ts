import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Revalidate the blog pages
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog pages revalidated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate blog pages' },
      { status: 500 }
    );
  }
}

