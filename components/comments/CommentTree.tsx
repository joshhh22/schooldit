'use client';

import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Comment } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { CommentItem } from './CommentItem';
import { useToast } from '@/components/ui/Toast';

interface CommentTreeProps {
  postId: string;
  comments: Comment[];
}

export function CommentTree({ postId, comments }: CommentTreeProps) {
  const { addComment, session } = useSchooldit();
  const { showToast } = useToast();
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(postId, commentText.trim());
    setCommentText('');
    showToast('Komentar Terkirim!', `Diposting sebagai ${session.pseudonym}`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Level Comment Composer */}
      <form
        onSubmit={handleAddComment}
        className="p-3 sm:p-4 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-200 dark:border-[#252c36]"
      >
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Komentar sebagai</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-[#14181d] border border-slate-200 dark:border-[#252c36] text-slate-800 dark:text-slate-200">
            <span>{session.avatar}</span>
            <span>{session.pseudonym}</span>
          </span>
        </div>

        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-[#252c36] bg-white dark:bg-[#14181d] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-orange-500 transition-all"
        />

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[11px] text-slate-400">
            🔒 Identitas asli tidak ditampilkan.
          </span>
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold rounded-full transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Comments ({comments.length})</span>
          </h4>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-[#252c36] rounded-xl">
            <p className="text-xs text-slate-400">
              No comments yet. Be the first to share what you think!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#252c36]">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId} depth={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
