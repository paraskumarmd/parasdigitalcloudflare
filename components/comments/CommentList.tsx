'use client';

import { useState, useEffect } from 'react';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Loader2, MessageSquare, RefreshCw } from 'lucide-react';

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  author_website?: string;
  content: string;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

interface CommentListProps {
  blogSlug: string;
}

export function CommentList({ blogSlug }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching comments for blog slug:', blogSlug);
      const response = await fetch(`/api/comments?blog_slug=${encodeURIComponent(blogSlug)}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: Failed to fetch comments`);
      }
      
      const data = await response.json();
      console.log('Comments data received:', data);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogSlug]);

  const handleCommentSubmitted = () => {
    fetchComments();
    setShowCommentForm(false);
  };

  const handleRefresh = () => {
    fetchComments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-muted-foreground">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-2 px-3 py-1 text-sm border border-red-300 rounded hover:bg-red-100"
        >
          <RefreshCw className="h-3 w-3 mr-1 inline" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">
            Comments ({comments.length})
          </h3>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 inline ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Comment Form */}
      {!showCommentForm ? (
        <button
          onClick={() => setShowCommentForm(true)}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <MessageSquare className="h-4 w-4 mr-2 inline" />
          Leave a Comment
        </button>
      ) : (
        <CommentForm
          blogSlug={blogSlug}
          onCommentSubmitted={handleCommentSubmitted}
          onCancel={() => setShowCommentForm(false)}
        />
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
          {error && (error.includes('relation "comments" does not exist') || error.includes('Could not find the table')) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Setup Required:</strong> The comments database table hasn't been created yet. 
                Please run the SQL setup script in your Supabase dashboard.
              </p>
              <div className="mt-2">
                <a 
                  href="/QUICK_SETUP.md" 
                  target="_blank" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  View Setup Instructions →
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              blogSlug={blogSlug}
              onReplySubmitted={handleCommentSubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
