-- Create the comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_slug VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_website VARCHAR(500),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_blog_slug ON comments(blog_slug);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_author_email ON comments(author_email);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
-- Allow anyone to insert comments (for public commenting)
CREATE POLICY "Allow insert for all users" ON comments
  FOR INSERT WITH CHECK (true);

-- Allow reading approved comments for everyone
CREATE POLICY "Allow read approved comments" ON comments
  FOR SELECT USING (status = 'approved');

-- Allow reading all comments for authenticated users (for moderation)
CREATE POLICY "Allow read all for authenticated users" ON comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow updating comments for authenticated users (for moderation)
CREATE POLICY "Allow update for authenticated users" ON comments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow deleting comments for authenticated users (for moderation)
CREATE POLICY "Allow delete for authenticated users" ON comments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON comments TO authenticated;
GRANT ALL ON comments TO service_role;
GRANT ALL ON comments TO anon;

-- Create a view for approved comments with nested structure
CREATE OR REPLACE VIEW approved_comments_view AS
WITH RECURSIVE comment_tree AS (
  -- Base case: top-level comments
  SELECT 
    id,
    blog_slug,
    parent_id,
    author_name,
    author_email,
    author_website,
    content,
    created_at,
    updated_at,
    0 as depth,
    ARRAY[id] as path
  FROM comments 
  WHERE parent_id IS NULL AND status = 'approved'
  
  UNION ALL
  
  -- Recursive case: replies
  SELECT 
    c.id,
    c.blog_slug,
    c.parent_id,
    c.author_name,
    c.author_email,
    c.author_website,
    c.content,
    c.created_at,
    c.updated_at,
    ct.depth + 1,
    ct.path || c.id
  FROM comments c
  JOIN comment_tree ct ON c.parent_id = ct.id
  WHERE c.status = 'approved'
)
SELECT * FROM comment_tree ORDER BY path;
