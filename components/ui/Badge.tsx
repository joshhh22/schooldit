'use client';

import React from 'react';
import {
  Flame,
  MessageSquare,
  Sparkles,
  Smile,
  Heart,
  HelpCircle,
  Megaphone,
  Calendar,
  Hash,
} from 'lucide-react';
import { PostFlair } from '@/lib/types';

const FLAIR_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  RAMAI: {
    label: 'RAMAI',
    icon: Flame,
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30 dark:border-sky-500/30',
  },
  SPILL: {
    label: 'SPILL',
    icon: Sparkles,
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30 dark:border-amber-500/30',
  },
  NGOBROL: {
    label: 'NGOBROL',
    icon: MessageSquare,
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30 dark:border-blue-500/30',
  },
  WKWK: {
    label: 'WKWK',
    icon: Smile,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30 dark:border-emerald-500/30',
  },
  CURHAT: {
    label: 'CURHAT',
    icon: Heart,
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30 dark:border-rose-500/30',
  },
  INFO: {
    label: 'INFO',
    icon: Megaphone,
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/30 dark:border-cyan-500/30',
  },
  TANYA: {
    label: 'TANYA',
    icon: HelpCircle,
    bg: 'bg-teal-500/10 dark:bg-teal-500/15',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30 dark:border-teal-500/30',
  },
  EVENT: {
    label: 'EVENT',
    icon: Calendar,
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30 dark:border-indigo-500/30',
  },
};

interface FlairBadgeProps {
  flair: PostFlair;
  size?: 'sm' | 'md';
  onClick?: () => void;
  isActive?: boolean;
}

export function FlairBadge({ flair, size = 'md', onClick, isActive }: FlairBadgeProps) {
  const config = FLAIR_CONFIG[flair] || {
    label: flair,
    icon: Hash,
    bg: 'bg-slate-500/10 dark:bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-500/30 dark:border-slate-500/30',
  };

  const Icon = config.icon;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-bold rounded-full border transition-all ${
        config.bg
      } ${config.text} ${config.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${
        isActive
          ? 'ring-2 ring-sky-500 bg-sky-500/20 text-sky-500 dark:text-sky-400 font-bold scale-105'
          : ''
      } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
    >
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
