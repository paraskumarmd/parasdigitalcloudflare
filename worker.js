// Cloudflare Worker for Paras Digital Portfolio
// This worker serves the static Next.js export and handles API routes

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    
    // Serve static files
    return handleStaticRequest(request, env);
  },
};

async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  
  // Set environment variables for API routes
  process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.NOTION_API_KEY = env.NOTION_API_KEY;
  process.env.NOTION_DATABASE_ID = env.NOTION_DATABASE_ID;
  process.env.EMAIL_HOST = env.EMAIL_HOST;
  process.env.EMAIL_PORT = env.EMAIL_PORT;
  process.env.EMAIL_USER = env.EMAIL_USER;
  process.env.EMAIL_PASS = env.EMAIL_PASS;
  process.env.EMAIL_TO = env.EMAIL_TO;
  process.env.CONTACT_TABLE_NAME = env.CONTACT_TABLE_NAME;
  
  // Import and handle the specific API route
  try {
    if (url.pathname === '/api/blog-posts') {
      const { GET } = await import('./api/blog-posts/route.js');
      return GET(request);
    }
    
    if (url.pathname.startsWith('/api/comments')) {
      if (url.pathname === '/api/comments') {
        const { GET, POST } = await import('./api/comments/route.js');
        if (request.method === 'GET') return GET(request);
        if (request.method === 'POST') return POST(request);
      }
      
      if (url.pathname.startsWith('/api/comments/moderate')) {
        const { GET, POST } = await import('./api/comments/moderate/route.js');
        if (request.method === 'GET') return GET(request);
        if (request.method === 'POST') return POST(request);
      }
      
      if (url.pathname.match(/^\/api\/comments\/[^\/]+$/)) {
        const { PUT, DELETE } = await import('./api/comments/[id]/route.js');
        if (request.method === 'PUT') return PUT(request, { params: Promise.resolve({ id: url.pathname.split('/')[3] }) });
        if (request.method === 'DELETE') return DELETE(request, { params: Promise.resolve({ id: url.pathname.split('/')[3] }) });
      }
    }
    
    if (url.pathname === '/api/contact') {
      const { POST } = await import('./api/contact/route.js');
      return POST(request);
    }
    
    return new Response('API route not found', { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function handleStaticRequest(request, env) {
  // This would typically serve static files from KV storage
  // For now, return a simple response
  return new Response('Static file serving not implemented yet', { status: 501 });
}
