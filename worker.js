// Main Cloudflare Worker entry point for Paras Digital Portfolio
import { handleBlogPostsRequest } from './workers/api/blog-posts';
import { handleCommentsRequest } from './workers/api/comments';
import { handleContactRequest } from './workers/api/contact';
import { handleCommentsModerateRequest } from './workers/api/comments-moderate';
import { handleCommentsByIdRequest } from './workers/api/comments-by-id';

// Import Next.js server for handling static pages
import { NextRequest } from 'next/server';

// This will be the Next.js server instance
let nextServer = null;

async function getNextServer() {
  if (!nextServer) {
    // Import the Next.js server dynamically
    const { default: server } = await import('./.next/server.js');
    nextServer = server;
  }
  return nextServer;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Handle API routes first
      if (url.pathname.startsWith('/api/blog-posts')) {
        return await handleBlogPostsRequest(request, env);
      }
      
      if (url.pathname.startsWith('/api/comments/moderate')) {
        return await handleCommentsModerateRequest(request, env);
      }
      
      if (url.pathname.startsWith('/api/comments/') && url.pathname.split('/').length === 4) {
        const id = url.pathname.split('/')[3];
        return await handleCommentsByIdRequest(request, env, id);
      }
      
      if (url.pathname.startsWith('/api/comments')) {
        return await handleCommentsRequest(request, env);
      }
      
      if (url.pathname.startsWith('/api/contact')) {
        return await handleContactRequest(request, env);
      }
      
      // Handle static pages and other routes with Next.js
      try {
        const server = await getNextServer();
        const nextRequest = new NextRequest(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        
        return await server.fetch(nextRequest);
      } catch (error) {
        console.error('Next.js server error:', error);
        
        // Fallback: serve a simple HTML response
        return new Response(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Paras Digital Portfolio</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 600px; margin: 0 auto; }
                .error { color: #e74c3c; }
                .success { color: #27ae60; }
                a { color: #3498db; text-decoration: none; }
                a:hover { text-decoration: underline; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Paras Digital Portfolio</h1>
                <p class="success">✅ Worker is running successfully!</p>
                <p>API routes are working:</p>
                <ul>
                  <li><a href="/api/blog-posts">/api/blog-posts</a> - Blog posts API</li>
                  <li><a href="/api/comments">/api/comments</a> - Comments API</li>
                  <li><a href="/api/contact">/api/contact</a> - Contact form API</li>
                </ul>
                <p class="error">⚠️ Static file serving is being set up...</p>
                <p>This is a Cloudflare Worker deployment. Static pages will be available soon.</p>
              </div>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' },
          status: 200
        });
      }
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};