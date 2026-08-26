'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Plus,
  ArrowLeft,
  Hash,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { PostCard } from '@/components/post/PostCard';
import { PostFilter } from '@/components/post/PostFilter';

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { schools, posts } = useSchooldit();

  const slug = params.slug as string;
  const community = schools.find((s) => s.slug === slug);

  if (!community) {
    return (
      <div className="reddit-card p-10 text-center space-y-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] font-sans">
        <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
          Komunitas Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-400">
          Komunitas s/{slug} belum dibuat atau telah dihapus.
        </p>
        <button
          onClick={() => router.push('/sekolah')}
          className="px-5 py-2 text-xs font-bold bg-sky-500 text-white rounded-full"
        >
          Lihat Semua Komunitas
        </button>
      </div>
    );
  }

  const communityPosts = posts.filter(
    (p) => p.schoolId === community.id || p.schoolSlug === community.slug
  );

  return (
    <div className="space-y-4 font-sans">
      {/* Back Button */}
      <button
        onClick={() => router.push('/sekolah')}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-[#1e293b] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162035] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Explore Communities</span>
      </button>

      {/* Subreddit Banner Card */}
      <div className="reddit-card overflow-hidden bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
        <div
          className="h-20 sm:h-24 w-full"
          style={{ backgroundColor: community.badgeColor }}
        />
        <div className="p-4 sm:p-5 -mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-white dark:border-[#0f1626] shadow-xs"
                style={{ backgroundColor: community.badgeColor }}
              >
                s/
              </div>
              <div className="mb-0.5">
                <h1 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  s/{community.slug}
                </h1>
                <p className="text-xs text-slate-400">
                  {community.name} {community.category ? `• ${community.category}` : ''}
                </p>
              </div>
            </div>

            <Link
              href={`/posting?school=${community.id}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-bold rounded-full transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-3" />
              <span>Create Post in s/{community.slug}</span>
            </Link>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-sans">
            {community.description}
          </p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-[#1e293b] text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <strong className="text-slate-800 dark:text-slate-200">{community.memberCount}</strong> anggota
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <strong className="text-slate-800 dark:text-slate-200">{communityPosts.length}</strong> postingan
            </span>
          </div>
        </div>
      </div>

      <PostFilter />

      {/* Posts List or Clean Empty State */}
      <div className="space-y-3">
        {communityPosts.length > 0 ? (
          communityPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="reddit-card p-10 text-center space-y-3 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-200">
              Belum Ada Postingan di s/{community.slug}
            </h3>
            <p className="text-xs text-slate-400">
              Jadilah yang pertama membuat postingan atau obrolan di komunitas ini!
            </p>
            <div className="pt-2">
              <Link
                href={`/posting?school=${community.id}`}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-full"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Postingan Pertama</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
