'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Globe, Plus, Shield } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f1626]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#1e293b] px-2 py-1.5 font-sans">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname === '/'
              ? 'text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Popular */}
        <Link
          href="/ramai"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname === '/ramai'
              ? 'text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px]">Popular</span>
        </Link>

        {/* + Create Button */}
        <Link
          href="/posting"
          className="-mt-4 flex items-center justify-center w-11 h-11 rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-3" />
        </Link>

        {/* Explore Schools */}
        <Link
          href="/sekolah"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname.startsWith('/sekolah')
              ? 'text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px]">Schools</span>
        </Link>

        {/* Admin Moderation */}
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname === '/admin'
              ? 'text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </Link>
      </div>
    </nav>
  );
}
