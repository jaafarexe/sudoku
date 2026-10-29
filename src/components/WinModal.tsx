import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, AlertCircle, Lightbulb, Play, ArrowRight, X } from 'lucide-react';
import { Difficulty } from '../types/sudoku';
import { formatTime } from '../utils/storage';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: Difficulty;
  timeSeconds: number;
  isNewBestTime: boolean;
  mistakes: number;
  hintsUsed: number;
  onPlayAgain: () => void;
  onNextDifficulty: () => void;
}

const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  onClose,
  difficulty,
  timeSeconds,
  isNewBestTime,
  mistakes,
  hintsUsed,
  onPlayAgain,
  onNextDifficulty,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-inner">
          <Trophy className="w-9 h-9 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Puzzle Solved!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Outstanding work completing this <span className="font-semibold text-slate-700 dark:text-slate-200">{DIFFICULTY_NAMES[difficulty]}</span> grid.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          {/* Time */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {formatTime(timeSeconds)}
            </span>
            {isNewBestTime && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                New Record!
              </span>
            )}
          </div>

          {/* Mistakes */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Mistakes
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {mistakes}
            </span>
          </div>

          {/* Hints */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Hints
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {hintsUsed}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors cursor-pointer"
          >
            Play Again ({DIFFICULTY_NAMES[difficulty]})
          </button>
          <button
            onClick={onNextDifficulty}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Next Level</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
