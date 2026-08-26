'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  Globe,
  Plus,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';

export function SidebarLeft() {
  const pathname = usePathname();
  const {
    schools,
    selectedSchool,
    setSelectedSchool,
    selectedFlair,
    setSelectedFlair,
    availableFlairs,
    sidebarOpen,
  } = useSchooldit();

  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [communitiesExpanded, setCommunitiesExpanded] = useState(true);
  const [flairsExpanded, setFlairsExpanded] = useState(true);

  if (!sidebarOpen) return null;

  return (
    <>
      <aside className="w-64 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto px-3 py-4 border-r border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f1626] text-xs transition-all space-y-4 font-sans">
        {/* Main Feeds Navigation */}
        <div className="space-y-0.5">
          <Link
            href="/"
            onClick={() => {
              setSelectedSchool('all');
              setSelectedFlair('ALL');
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-colors ${
              pathname === '/' && selectedSchool === 'all' && selectedFlair === 'ALL'
                ? 'bg-slate-100 dark:bg-[#162035] text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162035]'
            }`}
          >
            <Home className="w-5 h-5 text-slate-400" />
            <span>Home</span>
          </Link>

          <Link
            href="/ramai"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-colors ${
              pathname === '/ramai'
                ? 'bg-slate-100 dark:bg-[#162035] text-sky-500 dark:text-sky-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162035]'
            }`}
          >
            <TrendingUp className="w-5 h-5 text-sky-500" />
            <span>Popular</span>
          </Link>

          <Link
            href="/sekolah"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-colors ${
              pathname === '/sekolah'
                ? 'bg-slate-100 dark:bg-[#162035] text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162035]'
            }`}
          >
            <Globe className="w-5 h-5 text-blue-500" />
            <span>Explore Schools</span>
          </Link>

          <button
            onClick={() => setIsCreateSchoolOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162035] text-left transition-colors"
          >
            <Plus className="w-5 h-5 text-slate-400" />
            <span>Start a community</span>
          </button>
        </div>

        <hr className="border-slate-200 dark:border-[#1e293b]" />

        {/* Communities Section */}
        <div>
          <button
            onClick={() => setCommunitiesExpanded(!communitiesExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] hover:text-slate-200"
          >
            <span>COMMUNITIES</span>
            {communitiesExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {communitiesExpanded && (
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setIsCreateSchoolOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162035] font-semibold text-left"
              >
                <Plus className="w-4 h-4 text-sky-400" />
                <span>+ Buat Komunitas Sekolah</span>
              </button>

              {schools.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-slate-400 text-center border border-dashed border-slate-200 dark:border-[#1e293b] rounded-xl my-1">
                  Belum ada komunitas.
                </div>
              ) : (
                schools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/sekolah/${school.slug}`}
                    onClick={() => setSelectedSchool(school.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
                      selectedSchool === school.id
                        ? 'bg-slate-100 dark:bg-[#162035] text-sky-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162035]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: school.badgeColor }}
                    />
                    <span className="truncate">s/{school.slug}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        <hr className="border-slate-200 dark:border-[#1e293b]" />

        {/* Dynamic Topics / Flair Section */}
        <div>
          <button
            onClick={() => setFlairsExpanded(!flairsExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] hover:text-slate-200"
          >
            <span>TOPICS</span>
            {flairsExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {flairsExpanded && (
            <div className="mt-1 space-y-0.5">
              {availableFlairs.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-slate-400 text-center border border-dashed border-slate-200 dark:border-[#1e293b] rounded-xl my-1">
                  Belum ada topik aktif.
                </div>
              ) : (
                availableFlairs.map((flair) => (
                  <button
                    key={flair}
                    onClick={() => setSelectedFlair(selectedFlair === flair ? 'ALL' : flair)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left font-medium transition-colors ${
                      selectedFlair === flair
                        ? 'bg-sky-500/15 text-sky-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162035]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span>{flair}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <hr className="border-slate-200 dark:border-[#1e293b]" />

        {/* Moderation Link */}
        <div className="space-y-0.5 pb-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162035] hover:text-slate-200 font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Admin Moderation</span>
          </Link>
        </div>
      </aside>

      <CreateSchoolModal
        isOpen={isCreateSchoolOpen}
        onClose={() => setIsCreateSchoolOpen(false)}
      />
    </>
  );
}
