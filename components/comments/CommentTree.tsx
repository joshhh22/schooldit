'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, Lock } from 'lucide-react';
import { Comment } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { CommentItem } from './CommentItem';
import { useToast } from '@/components/ui/Toast';

interface CommentTreeProps {
  postId: string;
  comments: Comment[];
}

export function CommentTree({ postId, comments }: CommentTreeProps) {
  const { session, addComment } = useSchooldit();
  const { showToast } = useToast();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(postId, newComment.trim());
    setNewComment('');
    showToast('Komentar Terkirim', 'Komentar anonimmu telah diterbitkan.', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Comment Input Box */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Komentar sebagai</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#162035] px-2 py-0.5 rounded-full border border-slate-200 dark:border-[#1e293b]">
            {session.avatar} {session.pseudonym}
          </span>
        </div>

        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition-all font-sans"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Identitas asli tidak ditampilkan.</span>
          </div>

          <button
            type="submit"
            disabled={!newComment.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white text-xs font-bold rounded-full transition-all active:scale-95 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Comment</span>
          </button>
        </div>
      </form>

      <hr className="border-slate-200 dark:border-[#1e293b]" />

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-sky-400" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            COMMENTS ({comments.length})
          </h4>
        </div>

        {comments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-[#1e293b] rounded-xl bg-slate-50/50 dark:bg-[#162035]/30">
            No comments yet. Be the first to share what you think!
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
