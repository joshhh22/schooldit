'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Plus,
  Shield,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';

export function SidebarRight() {
  const { trendingTags, setSearchQuery } = useSchooldit();
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);

  return (
    <>
      <aside className="w-full space-y-4 text-xs font-sans">
        {/* About Schooldit Box */}
        <div className="reddit-card p-4 space-y-3 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#1e293b]">
            <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-xs">
              s/
            </div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Home
            </h3>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-sans">
            Tempat anak sekolah ngomong tanpa nama. Bebas berekspresi, spill info, dan ngobrol tanpa takut identitas bocor.
          </p>

          <div className="space-y-2 pt-1">
            <Link
              href="/posting"
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-full transition-all text-xs shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-3" />
              <span>Create Post</span>
            </Link>

            <button
              onClick={() => setIsCreateSchoolOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-[#162035] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-[#334155] font-bold rounded-full transition-all text-xs"
            >
              <span>Create Community</span>
            </button>
          </div>
        </div>

        {/* Dynamic Trending Tags (Empty if 0 posts) */}
        <div className="reddit-card p-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-[#1e293b]">
            <h4 className="font-heading font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-sky-400" />
              <span>POPULAR TOPICS</span>
            </h4>
          </div>

          {trendingTags.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-[11px] py-1">
              Belum ada topik yang sedang ramai saat ini.
            </p>
          ) : (
            <div className="space-y-2">
              {trendingTags.map((item) => (
                <button
                  key={item.tag}
                  onClick={() => setSearchQuery(item.tag)}
                  className="w-full flex items-center justify-between py-1 text-left hover:text-sky-400 transition-colors"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.count} post
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Authentic Student Rules: 1. freedom, 2. no cepu, 3. no baper */}
        <div className="reddit-card p-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] space-y-2.5">
          <h4 className="font-heading font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-[#1e293b]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>SCHOOLDIT RULES</span>
          </h4>

          <ol className="list-decimal list-inside space-y-2.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-sans">
            <li>
              <strong className="text-slate-900 dark:text-white uppercase tracking-wide">freedom</strong>
              <p className="pl-4 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Bebas ngomong, curhat, diskusi, spill fakta, tanpa batasan topik.
              </p>
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white uppercase tracking-wide">no cepu</strong>
              <p className="pl-4 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Dilarang keras doxxing, sebar data pribadi, nama asli, atau nomor WA orang lain.
              </p>
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white uppercase tracking-wide">no baper</strong>
              <p className="pl-4 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Opini orang beda-beda. Jangan gampang tersinggung, nikmati obrolan santai.
              </p>
            </li>
          </ol>
        </div>

        {/* Footer Links */}
        <div className="px-2 text-[10px] text-slate-400 dark:text-slate-500 space-y-1.5">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/" className="hover:underline">Rules</Link>
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">User Agreement</Link>
            <Link href="/admin" className="hover:underline">Moderation</Link>
          </div>
          <p>Schooldit, Inc. © 2026. All rights reserved.</p>
        </div>
      </aside>

      <CreateSchoolModal
        isOpen={isCreateSchoolOpen}
        onClose={() => setIsCreateSchoolOpen(false)}
      />
    </>
  );
}
