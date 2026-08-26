import React from 'react';
import { PostFlair } from '@/lib/types';

interface FlairBadgeProps {
  flair: PostFlair;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const FLAIR_CONFIG: Record<
  PostFlair,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  RAMAI: {
    label: 'RAMAI',
    icon: '🔥',
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30 dark:border-orange-500/30',
  },
  SPILL: {
    label: 'SPILL',
    icon: '👀',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30 dark:border-amber-500/30',
  },
  NGOBROL: {
    label: 'NGOBROL',
    icon: '💬',
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30 dark:border-blue-500/30',
  },
  WKWK: {
    label: 'WKWK',
    icon: '😂',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30 dark:border-emerald-500/30',
  },
  CURHAT: {
    label: 'CURHAT',
    icon: '🥺',
    bg: 'bg-teal-500/10 dark:bg-teal-500/15',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-500/30 dark:border-teal-500/30',
  },
  INFO: {
    label: 'INFO',
    icon: '📢',
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30 dark:border-sky-500/30',
  },
  TANYA: {
    label: 'TANYA',
    icon: '❓',
    bg: 'bg-amber-600/10 dark:bg-amber-600/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-600/30 dark:border-amber-600/30',
  },
  EVENT: {
    label: 'EVENT',
    icon: '🎉',
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30 dark:border-rose-500/30',
  },
};

export function FlairBadge({
  flair,
  size = 'md',
  interactive = false,
  selected = false,
  onClick,
}: FlairBadgeProps) {
  const config = FLAIR_CONFIG[flair] || FLAIR_CONFIG.INFO;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full border transition-all duration-150 ${sizeClasses} ${
        config.bg
      } ${config.text} ${config.border} ${
        interactive
          ? 'cursor-pointer hover:opacity-80 active:scale-95'
          : ''
      } ${
        selected
          ? 'ring-2 ring-orange-500 bg-orange-500/20 text-orange-500 dark:text-orange-400 font-bold scale-105'
          : ''
      }`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
