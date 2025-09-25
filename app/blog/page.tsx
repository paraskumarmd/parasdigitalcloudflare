'use client';

// Remove the direct import since we'll use the API route
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = 'Blog - Paras Digital | AI & Digital Marketing Insights';
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog-posts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const fetchedPosts = await response.json();
        
        // Debug: Log all posts and their status values
        console.log('=== BLOG PAGE DEBUG ===');
        console.log('Total posts found:', fetchedPosts.length);
        fetchedPosts.forEach((post: any, index: number) => {
          const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
          const status = post.properties?.Status?.status?.name || '';
          console.log(`Post ${index + 1}: "${title}" - Status: "${status}"`);
        });
        console.log('=== END DEBUG ===');

        setPosts(fetchedPosts);
        
        // Extract all unique tags
        const tags = new Set<string>();
        fetchedPosts.forEach((post: any) => {
          const postTags = post.properties?.tags?.multi_select || [];
          console.log('Post tags for extraction:', postTags);
          postTags.forEach((tag: any) => {
            console.log('Adding tag:', tag.name);
            tags.add(tag.name);
          });
        });
        const uniqueTags = Array.from(tags).sort();
        console.log('All unique tags found:', uniqueTags);
        
        // If no tags found, show a message
        if (uniqueTags.length === 0) {
          console.log('No tags found in any posts. This might indicate:');
          console.log('1. Posts don\'t have tags assigned in Notion');
          console.log('2. The Tags property name is different');
          console.log('3. The Tags property is not a multi_select type');
        }
        
        setAllTags(uniqueTags);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Filter posts to only show published ones
  const publishedPosts = posts.filter((post: any) => {
    const status = post.properties?.Status?.status?.name || '';
    return status.toLowerCase() === 'published';
  });

  // Filter posts by selected tag
  const filteredPosts = selectedTag === 'all' 
    ? publishedPosts 
    : publishedPosts.filter((post: any) => {
        const postTags = post.properties?.tags?.multi_select || [];
        return postTags.some((tag: any) => tag.name === selectedTag);
      });

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Blog</h1>
      
      {/* Tag Filter Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag('all')}
            className="mb-2"
          >
            All Posts
          </Button>
          {allTags.length > 0 ? (
            allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className="mb-2"
              >
                {tag}
              </Button>
            ))
          ) : (
            <div className="text-sm text-muted-foreground mb-2 p-2 bg-muted rounded">
              No categories found. Make sure your Notion posts have tags assigned.
            </div>
          )}
        </div>
        {selectedTag !== 'all' && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} in "{selectedTag}"
          </p>
        )}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredPosts.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground text-lg">
              {selectedTag === 'all' 
                ? 'No blog posts found.' 
                : `No posts found in "${selectedTag}" category.`
              }
            </p>
          </div>
        ) : (
          filteredPosts.map((post: any) => {
            const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
            const description = post.properties?.Blogs?.rich_text?.[0]?.plain_text || '';
            const image = post.properties?.featuredImage?.files?.[0]?.file?.url || post.properties?.featuredImage?.files?.[0]?.external?.url || '';
            const slug = post.properties?.Slug?.rich_text?.[0]?.plain_text || '';
            const postTags = post.properties?.Tags?.multi_select || [];
            
            return (
              <Link key={post.id} href={`/blog/${slug}`} className="block">
                <div className="bg-background rounded-lg shadow p-6 flex flex-col hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {image && (
                    <div className="relative w-full h-48 mb-4">
                      <Image 
                        src={image} 
                        alt={title} 
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold mb-2 text-foreground">{title}</h2>
                  <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
                  
                  {/* Tags */}
                  {postTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {postTags.map((tag: any) => (
                        <Badge 
                          key={tag.id} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}