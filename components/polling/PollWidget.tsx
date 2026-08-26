'use client';

import React, { useState } from 'react';
import { BarChart2, CheckCircle2 } from 'lucide-react';
import { Poll } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import confetti from 'canvas-confetti';

interface PollWidgetProps {
  postId: string;
  poll: Poll;
}

export function PollWidget({ postId, poll }: PollWidgetProps) {
  const { votePoll } = useSchooldit();
  const [hasVotedLocally, setHasVotedLocally] = useState(false);

  const handleVote = (optionId: string) => {
    votePoll(postId, optionId);
    if (!hasVotedLocally) {
      setHasVotedLocally(true);
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    }
  };

  const isVoted = Boolean(poll.userVotedOptionId);

  return (
    <div className="my-3 p-3.5 bg-slate-50 dark:bg-[#162035] rounded-xl border border-slate-200 dark:border-[#1e293b] space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {poll.question}
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 font-mono">
          {poll.totalVotes} suara
        </span>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const isSelected = poll.userVotedOptionId === option.id;
          const percentage =
            poll.totalVotes > 0
              ? Math.round((option.votes / poll.totalVotes) * 100)
              : 0;

          return (
            <button
              key={option.id}
              onClick={(e) => {
                e.stopPropagation();
                handleVote(option.id);
              }}
              className={`w-full relative overflow-hidden rounded-xl border text-left p-2.5 transition-all text-xs flex items-center justify-between ${
                isSelected
                  ? 'border-sky-500 bg-sky-500/10 font-medium'
                  : 'border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f1626] hover:border-slate-400'
              }`}
            >
              {/* Fill Progress Bar */}
              {isVoted && (
                <div
                  className={`absolute left-0 top-0 bottom-0 opacity-15 transition-all duration-500 ${
                    isSelected ? 'bg-sky-500' : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Option Text */}
              <div className="flex items-center gap-2 relative z-10">
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                )}
                <span
                  className={
                    isSelected ? 'text-sky-400 font-bold' : 'text-slate-800 dark:text-slate-200'
                  }
                >
                  {option.text}
                </span>
              </div>

              {/* Percentage */}
              {isVoted && (
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 relative z-10">
                  {percentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
