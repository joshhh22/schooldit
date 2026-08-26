'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  Hash,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';

export default function CommunitiesDirectoryPage() {
  const { schools } = useSchooldit();
  const [search, setSearch] = useState('');
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);

  const filteredSchools = schools.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <div className="space-y-4 font-sans">
        {/* Header */}
        <div className="reddit-card p-4 sm:p-5 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-black">
                s/
              </div>
              <div>
                <h1 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Explore Communities
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Temukan atau buat komunitas untuk hobi, olahraga, game, musik, atau topik lainnya di Schooldit.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCreateSchoolOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-full transition-all text-xs shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-3" />
              <span>Create Community</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="mt-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama komunitas, s/slug, atau kategori..."
              className="w-full text-xs py-2.5 px-4 bg-slate-50 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        {/* Communities Grid or Clean Empty State */}
        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSchools.map((community) => (
              <Link
                key={community.id}
                href={`/sekolah/${community.slug}`}
                className="reddit-card p-4 hover:border-slate-400 dark:hover:border-[#334155] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: community.badgeColor }}
                      >
                        s/
                      </div>
                      <div>
                        <h3 className="font-heading text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                          s/{community.slug}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {community.name}
                        </p>
                      </div>
                    </div>

                    {community.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162035] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1e293b]">
                        {community.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3 font-sans">
                    {community.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-[#1e293b] text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {community.memberCount} anggota
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {community.postCount} post
                    </span>
                  </div>

                  <span className="font-bold text-sky-400 flex items-center gap-1">
                    <span>Masuk</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="reddit-card p-10 text-center space-y-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6 text-sky-400" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                {search ? 'Komunitas Tidak Ditemukan' : 'Belum Ada Komunitas Dibuat'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {search
                  ? `Tidak ada komunitas yang cocok dengan pencarian "${search}".`
                  : 'Buat komunitas pertamamu sekarang! Misal: Komunitas Basket, Gamer Mobile Legends, Musik Indie, Anime, dll.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsCreateSchoolOpen(true)}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-full transition-all shadow-xs"
              >
                + Buat Komunitas Sekarang
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateSchoolModal
        isOpen={isCreateSchoolOpen}
        onClose={() => setIsCreateSchoolOpen(false)}
      />
    </>
  );
}
