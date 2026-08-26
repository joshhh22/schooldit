'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Hash } from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { PostCard } from '@/components/post/PostCard';

export default function RamaiPage() {
  const { posts, trendingTags, setSearchQuery } = useSchooldit();

  const trendingPosts = [...posts].sort((a, b) => {
    const scoreA = a.votes * 2 + a.commentsCount * 3 + a.viewCount * 0.1;
    const scoreB = b.votes * 2 + b.commentsCount * 3 + b.viewCount * 0.1;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="reddit-card p-4 sm:p-5 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Popular Posts</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Postingan yang sedang paling banyak mendapatkan interaksi dan diskusi di Schooldit.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Trending Tag Cloud */}
      {trendingTags.length > 0 && (
        <div className="reddit-card p-3.5 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
          <h3 className="font-heading text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-sky-400" />
            <span>Popular Tags</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((item) => (
              <button
                key={item.tag}
                onClick={() => setSearchQuery(item.tag)}
                className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] hover:border-sky-400 text-slate-800 dark:text-slate-200 transition-colors"
              >
                {item.tag} <span className="text-slate-400 text-[10px] font-normal font-mono">({item.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts List or Clean Empty State */}
      <div className="space-y-3">
        {trendingPosts.length > 0 ? (
          trendingPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="reddit-card p-10 text-center space-y-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] flex items-center justify-center mx-auto text-slate-400">
              <Flame className="w-6 h-6 text-sky-400" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Belum Ada Postingan Populer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Saat pengguna mulai membuat postingan dan memberikan upvote, konten paling ramai akan muncul di halaman ini secara otomatis.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/posting"
                className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-full transition-all shadow-xs"
              >
                + Buat Postingan Pertama
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
