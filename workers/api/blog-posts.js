// Workers-compatible blog-posts API handler
import { Client } from '@notionhq/client';

export async function handleBlogPosts(request, env) {
  try {
    // Set up Notion client with environment variables
    const notion = new Client({ auth: env.NOTION_API_KEY });
    const databaseId = env.NOTION_DATABASE_ID;
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    // Debug logging
    console.log('=== WORKER BLOG API DEBUG ===');
    console.log('Total posts from Notion:', response.results.length);
    response.results.forEach((post, index) => {
      const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
      const tags = post.properties?.Tags?.multi_select || [];
      console.log(`Post ${index + 1}: "${title}" - Tags:`, tags.map(tag => tag.name));
    });
    console.log('=== END WORKER DEBUG ===');
    
    return new Response(JSON.stringify(response.results), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blog posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
