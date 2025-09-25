import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/notion';

export async function GET() {
  try {
    const posts = await getBlogPosts();
    
    // Debug: Log posts and their tags
    console.log('=== API ROUTE DEBUG ===');
    console.log('Total posts from Notion:', posts.length);
    posts.forEach((post: any, index: number) => {
      const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
      const tags = post.properties?.Tags?.multi_select || [];
      console.log(`Post ${index + 1}: "${title}" - Tags:`, tags.map((tag: any) => tag.name));
    });
    console.log('=== END API DEBUG ===');
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
