'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Removed UI component imports to avoid framer-motion dependency
import { Loader2, Send, CheckCircle } from 'lucide-react';

const commentSchema = z.object({
  author_name: z.string().min(2, 'Name must be at least 2 characters'),
  author_email: z.string().email('Please enter a valid email address'),
  author_website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  content: z.string().min(10, 'Comment must be at least 10 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  blogSlug: string;
  parentId?: string;
  onCommentSubmitted?: () => void;
  onCancel?: () => void;
  isReply?: boolean;
}

export function CommentForm({ 
  blogSlug, 
  parentId, 
  onCommentSubmitted, 
  onCancel, 
  isReply = false 
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog_slug: blogSlug,
          parent_id: parentId || null,
          author_name: data.author_name,
          author_email: data.author_email,
          author_website: data.author_website || null,
          content: data.content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Comment submission error:', result);
        throw new Error(result.details || result.error || 'Failed to submit comment');
      }

      setSubmitStatus('success');
      reset();
      
      // Call the callback after a short delay
      setTimeout(() => {
        onCommentSubmitted?.();
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmitStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit comment';
      
      // Show setup message if the table doesn't exist
      if (errorMessage.includes('Comments system not set up yet') || errorMessage.includes('setup_required')) {
        setErrorMessage('Comments system needs to be set up. Please contact the administrator.');
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-600 inline mr-2" />
        <span className="text-green-800">
          Thank you for your comment! It has been submitted and will be reviewed before being published.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          {isReply ? 'Reply to Comment' : 'Leave a Comment'}
        </h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errorMessage}</p>
              {errorMessage.includes('Comments system needs to be set up') && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>For Administrators:</strong> Run the SQL setup script in your Supabase dashboard to enable comments.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="author_name" className="block text-sm font-medium">Name *</label>
              <input
                id="author_name"
                {...register('author_name')}
                placeholder="Your name"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.author_name && (
                <p className="text-sm text-red-600">{errors.author_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="author_email" className="block text-sm font-medium">Email *</label>
              <input
                id="author_email"
                type="email"
                {...register('author_email')}
                placeholder="your@email.com"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.author_email && (
                <p className="text-sm text-red-600">{errors.author_email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="author_website" className="block text-sm font-medium">Website (optional)</label>
            <input
              id="author_website"
              {...register('author_website')}
              placeholder="https://yourwebsite.com"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.author_website && (
              <p className="text-sm text-red-600">{errors.author_website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">Comment *</label>
            <textarea
              id="content"
              {...register('content')}
              placeholder="Share your thoughts..."
              rows={4}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4 inline" />
                  {isReply ? 'Post Reply' : 'Post Comment'}
                </>
              )}
            </button>
            
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Your comment will be reviewed before being published. We reserve the right to moderate comments.
          </p>
        </form>
      </div>
    </div>
  );
}
