import React from 'react';
import { Lightbulb, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { SmartHint } from '../types/sudoku';

interface SmartHintModalProps {
  hint: SmartHint | null;
  onClose: () => void;
  onApplyHint: () => void;
}

export const SmartHintModal: React.FC<SmartHintModalProps> = ({
  hint,
  onClose,
  onApplyHint,
}) => {
  if (!hint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-6 h-6 stroke-[2.2] fill-amber-400/20" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Hint & Deduction
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {hint.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content explanation */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>{hint.explanation}</p>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cell: Row {hint.row + 1}, Col {hint.col + 1}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Target Value: {hint.value}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            I'll Try It Myself
          </button>
          <button
            onClick={onApplyHint}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply Value ({hint.value})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
