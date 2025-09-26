import { notFound } from 'next/navigation';
import { Client } from '@notionhq/client';
import { getPageContent } from '@/lib/notion';
import Image from 'next/image';
import { CodeBlock } from '@/components/ui/syntax-highlighter';
import { CommentList } from '@/components/comments/CommentList';

// Add ISR for automatic updates
export const revalidate = 3600; // Revalidate every hour

// Add this function to generate all possible routes at build time
export async function generateStaticParams() {
  // Check if environment variables are available
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.log('Notion environment variables not available during build, skipping static generation');
    return [];
  }
  
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_DATABASE_ID!;
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    // Only generate static pages for published posts
    const publishedPosts = response.results.filter((post: any) => {
      const status = post.properties?.Status?.status?.name || '';
      return status.toLowerCase() === 'published';
    });
    
    return publishedPosts.map((post: any) => ({
      slug: post.properties?.Slug?.rich_text?.[0]?.plain_text || post.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array to prevent build failure
    return [];
  }
}

async function getBlogPost(slug: string) {
  // Check if environment variables are available
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.log('Notion environment variables not available');
    return null;
  }
  
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_DATABASE_ID!;
    //console.log('Searching for slug:', slug);
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug
        }
      }
    });
    
    //console.log('Found posts:', response.results.length);
    //console.log('First result:', response.results[0]);
    
    return response.results[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  //console.log('BlogPostPage called with params:', params);
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postData = post as any; // Type assertion for Notion response
  
  // Check if the post is published
  const status = postData.properties?.Status?.status?.name || '';
  if (status.toLowerCase() !== 'published') {
    notFound(); // Hide unpublished posts
  }
  
  const title = postData.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
  const image = postData.properties?.featuredImage?.files?.[0]?.file?.url || postData.properties?.featuredImage?.files?.[0]?.external?.url || '';

  // Debug logging for featured image
  console.log('Featured image debug:', {
    title,
    image,
    hasFeaturedImage: !!postData.properties?.featuredImage,
    files: postData.properties?.featuredImage?.files
  });

  // Fetch the full page content
  const pageContent = await getPageContent(postData.id);
  
  // Debug: Log image blocks specifically
  const imageBlocks = pageContent.filter((block: any) => block.type === 'image');
  console.log('Image blocks found:', imageBlocks.length);
  imageBlocks.forEach((block: any, index: number) => {
    console.log(`Image block ${index + 1}:`, {
      id: block.id,
      type: block.type,
      hasFile: !!block.image?.file,
      hasExternal: !!block.image?.external,
      fileUrl: block.image?.file?.url,
      externalUrl: block.image?.external?.url,
      caption: block.image?.caption
    });
  });

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <article>
        {image && (
          <div className="relative w-full h-64 mb-8">
            <Image 
              src={image} 
              alt={title} 
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-6 text-foreground">{title}</h1>
        <div className="prose prose-lg max-w-none">
          {(() => {
            const renderBlocks = () => {
              const elements: JSX.Element[] = [];
              let i = 0;

              while (i < pageContent.length) {
                const block = pageContent[i];

                if (block.type === 'paragraph') {
                  elements.push(
                    <p key={block.id} className="text-muted-foreground leading-relaxed mb-4">
                      {block.paragraph.rich_text.map((text: any) => text.plain_text).join('')}
                    </p>
                  );
                } else if (block.type === 'heading_1') {
                  elements.push(
                    <h2 key={block.id} className="text-2xl font-bold mb-4 text-foreground">
                      {block.heading_1.rich_text.map((text: any) => text.plain_text).join('')}
                    </h2>
                  );
                } else if (block.type === 'heading_2') {
                  elements.push(
                    <h3 key={block.id} className="text-xl font-semibold mb-3 text-foreground">
                      {block.heading_2.rich_text.map((text: any) => text.plain_text).join('')}
                    </h3>
                  );
                } else if (block.type === 'heading_3') {
                  elements.push(
                    <h4 key={block.id} className="text-lg font-semibold mb-2 text-foreground">
                      {block.heading_3.rich_text.map((text: any) => text.plain_text).join('')}
                    </h4>
                  );
                } else if (block.type === 'bulleted_list_item') {
                  // Group consecutive bulleted list items
                  const bulletedItems = [];
                  while (i < pageContent.length && pageContent[i].type === 'bulleted_list_item') {
                    bulletedItems.push(pageContent[i]);
                    i++;
                  }
                  i--; // Adjust for the outer loop increment
                  
                  elements.push(
                    <ul key={`bulleted-${bulletedItems[0].id}`} className="list-disc list-inside mb-4">
                      {bulletedItems.map((item: any) => (
                        <li key={item.id} className="text-muted-foreground leading-relaxed">
                          {item.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('')}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (block.type === 'numbered_list_item') {
                  // Group consecutive numbered list items
                  const numberedItems = [];
                  while (i < pageContent.length && pageContent[i].type === 'numbered_list_item') {
                    numberedItems.push(pageContent[i]);
                    i++;
                  }
                  i--; // Adjust for the outer loop increment
                  
                  elements.push(
                    <ol key={`numbered-${numberedItems[0].id}`} className="list-decimal list-inside mb-4">
                      {numberedItems.map((item: any) => (
                        <li key={item.id} className="text-muted-foreground leading-relaxed">
                          {item.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')}
                        </li>
                      ))}
                    </ol>
                  );
                } else if (block.type === 'image') {
                  const imageUrl = block.image.file?.url || block.image.external?.url || '';
                  const caption = block.image.caption?.[0]?.plain_text || '';
                  
                  // Debug logging
                  console.log('Image block:', {
                    id: block.id,
                    imageUrl,
                    caption,
                    hasFile: !!block.image.file,
                    hasExternal: !!block.image.external
                  });
                  
                  if (imageUrl) {
                    elements.push(
                      <figure key={block.id} className="my-6">
                        <div className="relative w-full h-96">
                          <Image 
                            src={imageUrl} 
                            alt={caption || 'Blog image'} 
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                        </div>
                        {caption && (
                          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                            {caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  } else {
                    // Fallback for missing images
                    elements.push(
                      <div key={block.id} className="my-6 p-8 bg-muted rounded-lg text-center">
                        <p className="text-muted-foreground">Image could not be loaded</p>
                        {caption && (
                          <p className="text-sm text-muted-foreground mt-2">{caption}</p>
                        )}
                      </div>
                    );
                  }
                } else if (block.type === 'quote') {
                  elements.push(
                    <blockquote key={block.id} className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
                      {block.quote.rich_text.map((text: any) => text.plain_text).join('')}
                    </blockquote>
                  );
                } else if (block.type === 'code') {
                  const code = block.code.rich_text.map((text: any) => text.plain_text).join('');
                  const language = block.code.language || 'text';
                  
                  elements.push(
                    <CodeBlock 
                      key={block.id} 
                      code={code} 
                      language={language} 
                    />
                  );
                } else if (block.type === 'to_do') {
                  const isChecked = block.to_do.checked;
                  elements.push(
                    <div key={block.id} className="flex items-start gap-2 mb-2">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        readOnly
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className={`text-muted-foreground leading-relaxed ${isChecked ? 'line-through opacity-60' : ''}`}>
                        {block.to_do.rich_text.map((text: any) => text.plain_text).join('')}
                      </span>
                    </div>
                  );
                }

                i++;
              }

              return elements;
            };

            return renderBlocks();
          })()}
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-16 pt-8 border-t">
        <CommentList blogSlug={slug} />
      </section>
    </main>
  );
} 