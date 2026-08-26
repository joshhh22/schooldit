'use client';

import React from 'react';
import { Flame, Sparkles, TrendingUp, Compass, Hash } from 'lucide-react';
import { SortFilter } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { FlairBadge } from '@/components/ui/Badge';

export function PostFilter() {
  const { selectedFlair, setSelectedFlair, availableFlairs, sortBy, setSortBy } = useSchooldit();

  const sortOptions: { value: SortFilter; label: string; icon: React.ElementType }[] = [
    { value: 'best', label: 'Best', icon: Compass },
    { value: 'hot', label: 'Hot', icon: Flame },
    { value: 'new', label: 'New', icon: Sparkles },
    { value: 'top', label: 'Top', icon: TrendingUp },
  ];

  return (
    <div className="space-y-3 mb-4 font-sans">
      {/* Sort Pill Bar */}
      <div className="reddit-card p-2 sm:p-2.5 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-200 dark:bg-[#162035] text-sky-500 dark:text-sky-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162035] hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Topics Bar (Only show if real topics exist) */}
      {availableFlairs.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedFlair('ALL')}
            className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${
              selectedFlair === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-white dark:bg-[#0f1626] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e293b] hover:border-slate-400'
            }`}
          >
            All Topics
          </button>

          {availableFlairs.map((flair) => (
            <button
              key={flair}
              onClick={() => setSelectedFlair(selectedFlair === flair ? 'ALL' : flair)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all whitespace-nowrap flex items-center gap-1 ${
                selectedFlair === flair
                  ? 'bg-sky-500 text-white border-sky-500 font-bold'
                  : 'bg-white dark:bg-[#0f1626] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1e293b] hover:border-slate-400'
              }`}
            >
              <Hash className="w-3 h-3" />
              <span>{flair}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
