'use client';

import React from 'react';
import { CheckCircle2, BarChart2 } from 'lucide-react';
import { Poll } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

interface PollWidgetProps {
  postId: string;
  poll: Poll;
}

export function PollWidget({ postId, poll }: PollWidgetProps) {
  const { votePoll } = useSchooldit();
  const { showToast } = useToast();

  const handleVote = (optionId: string, optionText: string) => {
    votePoll(postId, optionId);
    showToast('Vote Recorded!', `You voted: "${optionText}"`, 'success');
  };

  const totalVotes = Math.max(1, poll.totalVotes);

  return (
    <div className="my-2.5 p-3.5 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-200 dark:border-[#252c36]">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-orange-500" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {poll.question}
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {poll.totalVotes} total votes
        </span>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const isVoted = poll.userVotedOptionId === option.id;
          const percentage = Math.round((option.votes / totalVotes) * 100) || 0;

          return (
            <button
              key={option.id}
              onClick={(e) => {
                e.stopPropagation();
                handleVote(option.id, option.text);
              }}
              className={`w-full relative overflow-hidden rounded-xl border text-left p-2.5 transition-all group ${
                isVoted
                  ? 'border-orange-500 bg-orange-500/10 font-medium'
                  : 'border-slate-200 dark:border-[#333d4b] bg-white dark:bg-[#14181d] hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              <div
                className={`absolute inset-0 transition-all duration-300 opacity-20 ${
                  isVoted ? 'bg-orange-500' : 'bg-slate-400 dark:bg-slate-600'
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {isVoted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  )}
                  <span
                    className={`truncate ${
                      isVoted ? 'text-orange-500 font-bold' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {option.text}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {option.votes} ({percentage}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
