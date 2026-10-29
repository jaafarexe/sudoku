import React from 'react';
import { X, Sparkles, Flame, Zap, Shield, RotateCcw } from 'lucide-react';
import { Difficulty } from '../types/sudoku';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onRestartCurrent: () => void;
  currentDifficulty: Difficulty;
}

const DIFFICULTIES: {
  id: Difficulty;
  name: string;
  desc: string;
  clues: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: 'easy',
    name: 'Easy',
    desc: 'Relaxed & approachable. Great for a quick warm-up.',
    clues: '~38 clues',
    icon: Sparkles,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
  },
  {
    id: 'medium',
    name: 'Medium',
    desc: 'Classic puzzle challenge requiring moderate deduction.',
    clues: '~32 clues',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60',
  },
  {
    id: 'hard',
    name: 'Hard',
    desc: 'Requires candidate elimination and cross-checking.',
    clues: '~28 clues',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
  },
  {
    id: 'expert',
    name: 'Expert',
    desc: 'Deep logic and multi-step deduction for true masters.',
    clues: '~24 clues',
    icon: Flame,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60',
  },
];

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onSelectDifficulty,
  onRestartCurrent,
  currentDifficulty,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Start New Game
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your preferred puzzle challenge
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty List */}
        <div className="grid grid-cols-1 gap-2.5 my-4">
          {DIFFICULTIES.map((diff) => {
            const Icon = diff.icon;
            const isCurrent = diff.id === currentDifficulty;

            return (
              <button
                key={diff.id}
                onClick={() => onSelectDifficulty(diff.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs group ${
                  isCurrent
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${diff.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {diff.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {diff.desc}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
                  {diff.clues}
                </span>
              </button>
            );
          })}
        </div>

        {/* Restart Current Option */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onRestartCurrent}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Current Puzzle</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
};
