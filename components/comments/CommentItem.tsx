'use client';

import React, { useState } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  CornerDownRight,
  Send,
  X,
  ShieldAlert,
} from 'lucide-react';
import { Comment } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { ReportModal } from '@/components/moderation/ReportModal';
import { useToast } from '@/components/ui/Toast';

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const { voteComment, addComment } = useSchooldit();
  const { showToast } = useToast();

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleVote = (direction: 'up' | 'down') => {
    voteComment(postId, comment.id, direction);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    addComment(postId, replyContent.trim(), comment.id);
    setReplyContent('');
    setIsReplying(false);
    showToast('Balasan Terkirim', 'Balasan anonim telah ditambahkan.', 'success');
  };

  return (
    <div className="space-y-2 text-xs font-sans">
      {/* Main Comment Row */}
      <div className="flex gap-2.5 group">
        {/* Author Avatar circle */}
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] flex items-center justify-center shrink-0 text-sm">
          {comment.authorAvatar}
        </div>

        <div className="flex-1 space-y-1">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {comment.authorPseudonym}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 text-[11px]">{comment.createdAt}</span>
          </div>

          {/* Text Content */}
          <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
            {comment.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
            {/* Votes */}
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-[#162035] rounded-full px-1.5 py-0.5 border border-slate-200 dark:border-[#1e293b]">
              <button
                onClick={() => handleVote('up')}
                className={`p-0.5 rounded transition-colors ${
                  comment.userVote === 'up'
                    ? 'text-sky-400'
                    : 'text-slate-400 hover:text-sky-400'
                }`}
              >
                <ArrowBigUp className="w-3.5 h-3.5 fill-current" />
              </button>

              <span
                className={`font-mono font-bold px-1 ${
                  comment.userVote === 'up'
                    ? 'text-sky-400'
                    : comment.userVote === 'down'
                    ? 'text-rose-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {comment.votes}
              </span>

              <button
                onClick={() => handleVote('down')}
                className={`p-0.5 rounded transition-colors ${
                  comment.userVote === 'down'
                    ? 'text-rose-400'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <ArrowBigDown className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Reply Button */}
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-sky-400 font-semibold px-2 py-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#162035] transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Reply</span>
            </button>

            {/* Report Button */}
            <button
              onClick={() => setIsReportOpen(true)}
              className="hover:text-rose-400 p-0.5 transition-colors"
              title="Laporkan Komentar"
            >
              <ShieldAlert className="w-3 h-3" />
            </button>
          </div>

          {/* Inline Reply Form */}
          {isReplying && (
            <form onSubmit={handleSendReply} className="mt-2 flex items-center gap-2 animate-in fade-in duration-150">
              <div className="relative flex-1">
                <input
                  type="text"
                  autoFocus
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Balas ${comment.authorPseudonym}...`}
                  className="w-full text-xs py-2 px-3 pr-8 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-4 border-l-2 border-slate-200 dark:border-[#1e293b] space-y-3 mt-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={comment.id}
        targetType="comment"
        targetContent={comment.content}
      />
    </div>
  );
}
