'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
// Removed UI component imports to avoid framer-motion dependency.
import { Reply, ExternalLink, Calendar } from 'lucide-react';
import { CommentForm } from './CommentForm';

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

interface CommentItemProps {
  comment: Comment;
  blogSlug: string;
  onReplySubmitted?: () => void;
}

export function CommentItem({ comment, blogSlug, onReplySubmitted }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmitted = () => {
    setShowReplyForm(false);
    onReplySubmitted?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 border-l-4 border-l-primary/20 rounded-lg">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-primary/10 text-primary font-medium rounded-full flex items-center justify-center">
              {getInitials(comment.author_name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-foreground truncate">
                  {comment.author_name}
                </h4>
                
                {comment.author_website && (
                  <a
                    href={comment.author_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(comment.created_at)}</span>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
              
              <div className="mt-3">
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-xs px-2 py-1 text-primary hover:bg-primary/10 rounded"
                >
                  <Reply className="h-3 w-3 mr-1 inline" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-8">
          <CommentForm
            blogSlug={blogSlug}
            parentId={comment.id}
            onCommentSubmitted={handleReplySubmitted}
            onCancel={() => setShowReplyForm(false)}
            isReply={true}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              blogSlug={blogSlug}
              onReplySubmitted={onReplySubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
