'use client';

import React, { useState } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  CornerDownRight,
  ShieldAlert,
  Send,
  X,
} from 'lucide-react';
import { Comment } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { ReportModal } from '@/components/moderation/ReportModal';
import { useToast } from '@/components/ui/Toast';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  depth?: number;
}

export function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const { voteComment, addComment, session } = useSchooldit();
  const { showToast } = useToast();

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isVoteBouncing, setIsVoteBouncing] = useState<'up' | 'down' | null>(null);

  const handleVote = (direction: 'up' | 'down') => {
    setIsVoteBouncing(direction);
    voteComment(postId, comment.id, direction);
    setTimeout(() => setIsVoteBouncing(null), 250);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addComment(postId, replyText.trim(), comment.id);
    setReplyText('');
    setIsReplying(false);
    showToast('Balasan Terkirim!', `Dibalas sebagai ${session.pseudonym}`, 'success');
  };

  const maxDepth = 4;

  return (
    <div className={`relative ${depth > 0 ? 'ml-2.5 sm:ml-5 pl-2 sm:pl-3 border-l-2 border-slate-200 dark:border-[#252c36]' : ''}`}>
      <div className="py-2.5 group">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-sm">{comment.authorAvatar}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {comment.authorPseudonym}
            </span>
            <span className="text-slate-400 text-[11px]">
              • {comment.createdAt}
            </span>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            aria-label="Laporkan Komentar"
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pl-5 whitespace-pre-line">
          {comment.content}
        </p>

        {/* Action bar (Vote, Reply) */}
        <div className="flex items-center gap-2 pl-5 mt-1.5">
          {/* Vote Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-[#1a1f26] rounded-full px-1 py-0.5 border border-slate-200 dark:border-[#252c36]">
            <button
              onClick={() => handleVote('up')}
              className={`p-1 rounded-full ${
                comment.userVote === 'up'
                  ? 'text-orange-500'
                  : 'text-slate-400 hover:text-orange-500'
              } ${isVoteBouncing === 'up' ? 'animate-vote-pop' : ''}`}
            >
              <ArrowBigUp className="w-3.5 h-3.5 fill-current" />
            </button>
            <span
              className={`px-1 text-[11px] font-bold font-mono ${
                comment.userVote === 'up'
                  ? 'text-orange-500'
                  : comment.userVote === 'down'
                  ? 'text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {comment.votes}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded-full ${
                comment.userVote === 'down'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-blue-400'
              } ${isVoteBouncing === 'down' ? 'animate-vote-pop' : ''}`}
            >
              <ArrowBigDown className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Reply Button */}
          {depth < maxDepth && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-orange-500 font-semibold px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#1a1f26] transition-colors"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Inline Reply Box */}
        {isReplying && (
          <form onSubmit={handleSendReply} className="mt-2 pl-5">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply as ${session.pseudonym}...`}
                  className="w-full text-xs py-2 px-3 pr-8 rounded-xl border border-slate-200 dark:border-[#252c36] bg-white dark:bg-[#14181d] text-slate-900 dark:text-white focus:outline-hidden focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Render Nested Child Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0.5">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

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
