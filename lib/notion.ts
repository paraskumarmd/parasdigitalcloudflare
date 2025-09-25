import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getBlogPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  
  /*
    console.log('Page content:', pageContent);
  console.log('Fetched posts:', response.results);
  response.results.forEach(post => {
    console.log('Image property:', post.properties.featuredImage);
  });
  */
  return response.results;
}

export async function getPageContent(pageId: string) {
  let allBlocks: any[] = [];
  let hasMore = true;
  let nextCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: nextCursor,
      page_size: 100, // Maximum page size
    });

    allBlocks = allBlocks.concat(response.results);
    hasMore = response.has_more;
    nextCursor = response.next_cursor || undefined;
  }

  return allBlocks;
}