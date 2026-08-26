'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { PostCard } from '@/components/post/PostCard';
import { CommentTree } from '@/components/comments/CommentTree';

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { getPostById, getCommentsForPost } = useSchooldit();

  const postId = params.id as string;
  const post = getPostById(postId);
  const comments = getCommentsForPost(postId);

  if (!post) {
    return (
      <div className="reddit-card p-10 text-center space-y-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] font-sans">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] flex items-center justify-center mx-auto text-slate-400">
          <MessageSquareOff className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
          Postingan Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-400">
          Postingan ini mungkin telah dihapus oleh admin atau tautan tidak valid.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-all"
        >
          Kembali ke Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-[#1e293b] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162035] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to feed</span>
      </button>

      {/* Main Post Detailed Card */}
      <PostCard post={post} isDetailedView={true} />

      {/* Nested Discussion Section */}
      <div className="reddit-card p-4 sm:p-5 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
        <CommentTree postId={post.id} comments={comments} />
      </div>
    </div>
  );
}
