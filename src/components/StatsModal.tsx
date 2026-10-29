import React, { useState } from 'react';
import { X, Trophy, Flame, Clock, Award } from 'lucide-react';
import { AllStats, Difficulty } from '../types/sudoku';
import { formatTime } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AllStats;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<Difficulty>('easy');

  if (!isOpen) return null;

  const currentStats = stats[activeTab];
  const winRate =
    currentStats.played > 0
      ? Math.round((currentStats.won / currentStats.played) * 100)
      : 0;

  const avgTime =
    currentStats.won > 0
      ? Math.round(currentStats.totalTimeSeconds / currentStats.won)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Your Statistics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your personal Sudoku records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl my-4">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveTab(diff)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === diff
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>

        {/* Stats Matrix */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {/* Games Played */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400">Games Played</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {currentStats.played}
            </p>
          </div>

          {/* Win Rate */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400">Win Rate</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {winRate}%
            </p>
            <span className="text-[11px] text-slate-400">({currentStats.won} won)</span>
          </div>

          {/* Best Time */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best Time
            </span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {currentStats.bestTimeSeconds !== null
                ? formatTime(currentStats.bestTimeSeconds)
                : '--:--'}
            </p>
          </div>

          {/* Average Time */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Average Time
            </span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {avgTime !== null ? formatTime(avgTime) : '--:--'}
            </p>
          </div>

          {/* Current Streak */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Current Streak
            </span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {currentStats.currentStreak}
            </p>
          </div>

          {/* Best Streak */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-500" /> Best Streak
            </span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {currentStats.bestStreak}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
