import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Required for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path } = body;

    // Verify the secret (you can set this in your environment variables)
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate the blog pages
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]');

    return NextResponse.json({ 
      message: 'Revalidated successfully',
      revalidated: true,
      now: Date.now()
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
