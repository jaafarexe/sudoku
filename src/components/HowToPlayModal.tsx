import React from 'react';
import { X, CheckCircle, HelpCircle, PenLine, Lightbulb } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                How to Play Sudoku
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simple rules & master solving techniques
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

        {/* The 3 Core Rules */}
        <div className="my-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            The 3 Golden Rules
          </h3>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                1. Every Row
              </strong>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Must contain every number from 1 to 9 exactly once without repeats.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                2. Every Column
              </strong>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Must contain numbers 1 through 9 with zero duplicate digits.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                3. Every 3×3 Box
              </strong>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Each of the 9 thick-bordered 3×3 sub-grids must also contain digits 1 to 9.
              </span>
            </div>
          </div>
        </div>

        {/* Master Tips */}
        <div className="my-4 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pro Tips & Features
          </h3>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <PenLine className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Use Notes Mode (Pencil)
              </strong>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tap the Notes button (or press 'N') to write potential candidate digits in empty cells without committing.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Smart Hints
              </strong>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Stuck on a tricky cell? Tap the Hint button to receive step-by-step logical explanations (e.g., Naked Singles or Hidden Singles).
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
