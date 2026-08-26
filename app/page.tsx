'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  BarChart2,
  Link2,
  Plus,
  SearchX,
  MessageSquarePlus,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { PostCard } from '@/components/post/PostCard';
import { PostFilter } from '@/components/post/PostFilter';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';

export default function HomePage() {
  const {
    isMounted,
    filteredPosts,
    session,
    selectedSchool,
    schools,
    searchQuery,
    setSearchQuery,
  } = useSchooldit();

  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);

  const activeSchoolObj = schools.find((s) => s.id === selectedSchool);

  return (
    <div className="space-y-4 font-sans">
      {/* Active School Banner (if filtered by school) */}
      {activeSchoolObj && (
        <div className="reddit-card p-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: activeSchoolObj.badgeColor }}
              >
                s/
              </div>
              <div>
                <h1 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  {activeSchoolObj.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  s/{activeSchoolObj.slug} • {activeSchoolObj.city}
                </p>
              </div>
            </div>
            <Link
              href="/sekolah"
              className="text-xs font-semibold text-sky-400 hover:underline"
            >
              Ganti Komunitas
            </Link>
          </div>
          {activeSchoolObj.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5">
              {activeSchoolObj.description}
            </p>
          )}
        </div>
      )}

      {/* Quick Create Post Pill Bar */}
      <div className="reddit-card p-2.5 sm:p-3 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#162035] flex items-center justify-center text-base border border-slate-200 dark:border-[#1e293b] shrink-0">
          {isMounted ? session.avatar : '🎓'}
        </div>

        <Link
          href="/posting"
          className="flex-1 py-2 px-4 bg-slate-100 dark:bg-[#162035] hover:bg-slate-200 dark:hover:bg-[#1c2a44] border border-slate-200 dark:border-[#1e293b] text-xs sm:text-sm text-slate-500 dark:text-slate-400 rounded-full transition-colors truncate"
        >
          Create Post...
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/posting?tab=image"
            title="Upload Media"
            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
          </Link>
          <Link
            href="/posting?tab=poll"
            title="Create Poll"
            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
          </Link>
          <Link
            href="/posting?tab=link"
            title="Insert Link"
            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-colors"
          >
            <Link2 className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Sort Controller */}
      <PostFilter />

      {/* Posts List or Clean Empty State */}
      <div className="space-y-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="reddit-card p-10 text-center space-y-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] flex items-center justify-center mx-auto text-slate-400">
              {searchQuery ? <SearchX className="w-6 h-6" /> : <MessageSquarePlus className="w-6 h-6 text-sky-400" />}
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : 'Belum Ada Postingan di Schooldit'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
                {searchQuery
                  ? 'Coba kata kunci lain atau bersihkan pencarian untuk melihat semua konten.'
                  : 'Forum masih bersih. Jadilah orang pertama yang membuat postingan, spill cerita, atau daftarkan komunitas sekolahmu!'}
              </p>
            </div>

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-xs font-semibold text-sky-400 hover:underline"
              >
                Reset Pencarian
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <Link
                  href="/posting"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-full transition-all shadow-xs"
                >
                  + Buat Postingan Pertama
                </Link>
                <button
                  onClick={() => setIsCreateSchoolOpen(true)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#334155] hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-all"
                >
                  + Daftarkan Sekolah
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateSchoolModal
        isOpen={isCreateSchoolOpen}
        onClose={() => setIsCreateSchoolOpen(false)}
      />
    </div>
  );
}
