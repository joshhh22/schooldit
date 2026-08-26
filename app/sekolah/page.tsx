'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  School as SchoolIcon,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';

export default function SchoolsDirectoryPage() {
  const { schools } = useSchooldit();
  const [search, setSearch] = useState('');
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);

  const filteredSchools = schools.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
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
                  Temukan atau buat komunitas forum sekolahmu di Schooldit.
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
              placeholder="Cari nama sekolah, s/slug, atau kota..."
              className="w-full text-xs py-2.5 px-4 bg-slate-50 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        {/* Communities Grid or Clean Empty State */}
        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSchools.map((school) => (
              <Link
                key={school.id}
                href={`/sekolah/${school.slug}`}
                className="reddit-card p-4 hover:border-slate-400 dark:hover:border-[#334155] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: school.badgeColor }}
                      >
                        s/
                      </div>
                      <div>
                        <h3 className="font-heading text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                          s/{school.slug}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {school.name}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162035] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1e293b]">
                      {school.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3 font-sans">
                    {school.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-[#1e293b] text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {school.memberCount} siswa
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {school.postCount} post
                    </span>
                  </div>

                  <span className="font-bold text-sky-400 flex items-center gap-1">
                    <span>Lihat</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="reddit-card p-10 text-center space-y-4 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] flex items-center justify-center mx-auto text-slate-400">
              <SchoolIcon className="w-6 h-6 text-sky-400" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                {search ? 'Komunitas Tidak Ditemukan' : 'Belum Ada Komunitas Sekolah Terdaftar'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {search
                  ? `Tidak ada sekolah yang cocok dengan pencarian "${search}".`
                  : 'Daftarkan sekolahmu sekarang agar kamu dan teman-teman satu sekolah bisa membuat thread dan obrolan!'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsCreateSchoolOpen(true)}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-full transition-all shadow-xs"
              >
                + Buat Komunitas Sekolah Sekarang
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
