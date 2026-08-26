'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Pin,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { Post } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { FlairBadge } from '@/components/ui/Badge';
import { PollWidget } from '@/components/polling/PollWidget';
import { ReportModal } from '@/components/moderation/ReportModal';
import { useToast } from '@/components/ui/Toast';

interface PostCardProps {
  post: Post;
  isDetailedView?: boolean;
}

export function PostCard({ post, isDetailedView = false }: PostCardProps) {
  const router = useRouter();
  const { votePost } = useSchooldit();
  const { showToast } = useToast();

  const [isVoteBouncing, setIsVoteBouncing] = useState<'up' | 'down' | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const handleVote = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.stopPropagation();
    setIsVoteBouncing(direction);
    votePost(post.id, direction);
    setTimeout(() => setIsVoteBouncing(null), 250);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/thread/${post.id}`;
      navigator.clipboard.writeText(url);
      showToast('Tautan Disalin!', 'Link postingan telah disalin ke clipboard.', 'success');
    }
  };

  const handleCardClick = () => {
    if (!isDetailedView) {
      router.push(`/thread/${post.id}`);
    }
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`reddit-card p-3 sm:p-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] font-sans ${
          !isDetailedView ? 'cursor-pointer hover:border-slate-300 dark:hover:border-[#334155]' : ''
        }`}
      >
        {/* Pinned Indicator */}
        {post.isPinned && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-2">
            <Pin className="w-3.5 h-3.5 fill-current rotate-45" />
            <span>PINNED BY COMMUNITY</span>
          </div>
        )}

        {/* Header: Subreddit/School + Author + Timestamp + Flair */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {/* School / Subreddit link */}
            <Link
              href={post.schoolId !== 'all' ? `/sekolah/${post.schoolSlug}` : '/'}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 hover:underline"
            >
              <span className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center font-black text-[10px]">
                s/
              </span>
              <span>{post.schoolId !== 'all' ? `s/${post.schoolSlug}` : 's/semua'}</span>
            </Link>

            <span>•</span>

            {/* Author */}
            <span className="flex items-center gap-1">
              <span>Diposting oleh</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {post.authorAvatar} {post.authorPseudonym}
              </span>
            </span>

            <span>•</span>

            {/* Timestamp */}
            <span>{post.createdAt}</span>

            {/* Flair */}
            <FlairBadge flair={post.flair} size="sm" />
          </div>

          {/* Options Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionsDropdown(!showOptionsDropdown);
              }}
              aria-label="Opsi Postingan"
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-[#162035] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showOptionsDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] rounded-xl shadow-xl py-1 z-40"
              >
                <button
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    setIsReportOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors font-medium"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Laporkan Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-heading font-bold text-slate-900 dark:text-white leading-snug mb-2 ${
            isDetailedView ? 'text-lg sm:text-xl' : 'text-base sm:text-lg hover:text-sky-400 transition-colors'
          }`}
        >
          {post.title}
        </h3>

        {/* Content Preview / Full Content */}
        <div className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-3 font-sans">
          {!isDetailedView && post.content.length > 300
            ? `${post.content.slice(0, 300)}...`
            : post.content}
        </div>

        {/* Media Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="my-3 space-y-2">
            {post.attachments.map((att) => (
              <div
                key={att.id}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e293b] bg-black/5 dark:bg-black/40 flex items-center justify-center max-h-[500px]"
              >
                {att.type === 'image' && (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="max-h-[500px] w-auto object-contain rounded-xl"
                    loading="lazy"
                  />
                )}
                {att.type === 'document' && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#162035] w-full">
                    <FileText className="w-6 h-6 text-sky-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{att.name}</p>
                      <p className="text-[11px] text-slate-400">{att.size}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Embedded Poll */}
        {post.poll && <PollWidget postId={post.id} poll={post.poll} />}

        {/* External Link */}
        {post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#162035] hover:bg-slate-100 dark:hover:bg-[#1c2a44] border border-slate-200 dark:border-[#1e293b] text-xs text-sky-400 font-medium mb-3 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{post.linkUrl}</span>
          </a>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-slate-400 hover:text-sky-400 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Reddit-Style Bottom Action Pill Bar */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          {/* Vote Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-[#162035] hover:bg-slate-200 dark:hover:bg-[#1c2a44] rounded-full p-0.5 border border-slate-200 dark:border-[#1e293b] transition-colors">
            <button
              onClick={(e) => handleVote(e, 'up')}
              aria-label="Upvote"
              className={`p-1.5 rounded-full transition-all ${
                post.userVote === 'up'
                  ? 'text-sky-400'
                  : 'text-slate-400 hover:text-sky-400'
              } ${isVoteBouncing === 'up' ? 'animate-vote-pop' : ''}`}
            >
              <ArrowBigUp className="w-4 h-4 fill-current" />
            </button>

            <span
              className={`px-1 font-bold text-xs font-mono ${
                post.userVote === 'up'
                  ? 'text-sky-400'
                  : post.userVote === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {post.votes}
            </span>

            <button
              onClick={(e) => handleVote(e, 'down')}
              aria-label="Downvote"
              className={`p-1.5 rounded-full transition-all ${
                post.userVote === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-400 hover:text-rose-400'
              } ${isVoteBouncing === 'down' ? 'animate-vote-pop' : ''}`}
            >
              <ArrowBigDown className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Comments Pill */}
          <button
            onClick={handleCardClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#162035] hover:bg-slate-200 dark:hover:bg-[#1c2a44] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#1e293b] transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>{post.commentsCount}</span>
            <span className="hidden sm:inline">Comments</span>
          </button>

          {/* Share Pill */}
          <button
            onClick={handleShare}
            aria-label="Share"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#162035] hover:bg-slate-200 dark:hover:bg-[#1c2a44] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#1e293b] transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </article>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={post.id}
        targetType="post"
        targetTitle={post.title}
        targetContent={post.content}
      />
    </>
  );
}
