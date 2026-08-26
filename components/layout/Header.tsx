'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  RefreshCw,
  Menu,
  Flame,
  X,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

export function Header() {
  const {
    isMounted,
    session,
    regenerateSession,
    searchQuery,
    setSearchQuery,
    toggleSidebar,
    theme,
    setTheme,
    isAdmin,
  } = useSchooldit();
  const { showToast } = useToast();

  const [isRerolling, setIsRerolling] = useState(false);

  const handleReroll = () => {
    setIsRerolling(true);
    const newSession = regenerateSession();
    setTimeout(() => {
      setIsRerolling(false);
      showToast(
        'Identitas Diacak!',
        `Kamu sekarang dikenal sebagai ${newSession.pseudonym}`,
        'info'
      );
    }, 200);
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f1626] border-b border-slate-200 dark:border-[#1e293b] transition-colors h-14 overflow-hidden">
      <div className="w-full px-2.5 sm:px-4 h-full flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Hamburger & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Navigation"
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-colors"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </div>
            <span className="font-heading font-extrabold tracking-tight text-base sm:text-lg text-slate-900 dark:text-white hidden min-[480px]:inline">
              schooldit
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-1 sm:mx-2 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Schooldit..."
              className="w-full text-xs sm:text-sm py-1.5 sm:py-2 pl-8 sm:pl-10 pr-7 sm:pr-8 reddit-input bg-slate-100 dark:bg-[#162035] border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* + Create Button (Desktop only, mobile has bottom bar button) */}
          <Link
            href="/posting"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-bold rounded-full transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span>Create</span>
          </Link>

          {/* Anonymous Session Identity Chip with Re-roll */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] rounded-full">
            <span className="text-xs sm:text-sm">
              {isMounted ? session.avatar : '🎓'}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[60px] sm:max-w-[100px] truncate hidden min-[360px]:inline">
              {isMounted
                ? session.pseudonym.replace('Anonymous ', '')
                : 'Siswa'}
            </span>
            <button
              onClick={handleReroll}
              title="Acak nama anonim"
              className="p-0.5 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRerolling ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={cycleTheme}
            aria-label="Toggle Theme"
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-colors"
          >
            {isMounted && theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>

          {/* Admin Link (Desktop only or clean icon) */}
          <Link
            href="/admin"
            title={isAdmin ? 'Admin Mode (Active)' : 'Admin Login'}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isAdmin
                ? 'text-sky-400 bg-sky-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#162035]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
