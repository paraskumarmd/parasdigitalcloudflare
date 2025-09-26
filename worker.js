// Main Cloudflare Worker for Paras Digital Portfolio
import { handleBlogPosts } from './workers/api/blog-posts.js';
import { handleComments } from './workers/api/comments.js';
import { handleContact } from './workers/api/contact.js';
import { handleCommentsModerate } from './workers/api/comments-moderate.js';
import { handleCommentsById } from './workers/api/comments-by-id.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    
    // Handle static files (for Next.js export)
    return handleStaticRequest(request, env);
  },
};

async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  
  try {
    // Blog posts API
    if (url.pathname === '/api/blog-posts') {
      return await handleBlogPosts(request, env);
    }
    
    // Comments API
    if (url.pathname === '/api/comments') {
      return await handleComments(request, env);
    }
    
    // Comments moderation API
    if (url.pathname === '/api/comments/moderate') {
      return await handleCommentsModerate(request, env);
    }
    
    // Comments by ID API (PUT/DELETE)
    const commentsByIdMatch = url.pathname.match(/^\/api\/comments\/([^\/]+)$/);
    if (commentsByIdMatch) {
      const commentId = commentsByIdMatch[1];
      return await handleCommentsById(request, env, commentId);
    }
    
    // Contact API
    if (url.pathname === '/api/contact') {
      return await handleContact(request, env);
    }
    
    // API route not found
    return new Response(JSON.stringify({ error: 'API route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStaticRequest(request, env) {
  const url = new URL(request.url);
  
  try {
    // For static files, we'll serve them from the out directory
    // This is a simplified implementation - in production you'd use KV storage
    
    // Default to index.html for SPA routing
    let filePath = url.pathname;
    if (filePath === '/' || !filePath.includes('.')) {
      filePath = '/index.html';
    }
    
    // Try to get the file from KV storage (if configured)
    // For now, return a simple response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Paras Digital Portfolio</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>Paras Digital Portfolio</h1>
          <p>Static file serving not fully implemented yet.</p>
          <p>API routes are working: <a href="/api/blog-posts">/api/blog-posts</a></p>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('Static file error:', error);
    return new Response('File not found', { status: 404 });
  }
}