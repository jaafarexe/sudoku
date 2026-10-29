import React from 'react';
import { Undo2, Eraser, PenLine, Lightbulb } from 'lucide-react';

interface ControlsProps {
  isNotesMode: boolean;
  onToggleNotesMode: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onErase: () => void;
  onTriggerHint: () => void;
  hintsRemaining: number;
  onInputNumber: (num: number) => void;
  numberCounts: Record<number, number>; // How many of each digit 1-9 are placed on the board
}

export const Controls: React.FC<ControlsProps> = ({
  isNotesMode,
  onToggleNotesMode,
  onUndo,
  canUndo,
  onErase,
  onTriggerHint,
  hintsRemaining,
  onInputNumber,
  numberCounts,
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-3.5 mt-2 select-none">
      {/* Action Toolbar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
            canUndo
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 shadow-xs'
              : 'bg-slate-100/60 dark:bg-slate-900/40 border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Undo last move (Ctrl+Z or U)"
        >
          <Undo2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
          <span className="text-[11px] sm:text-xs font-medium mt-1">Undo</span>
        </button>

        {/* Erase */}
        <button
          type="button"
          onClick={onErase}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 shadow-xs transition-all cursor-pointer"
          title="Erase cell value or notes (Backspace / Delete)"
        >
          <Eraser className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
          <span className="text-[11px] sm:text-xs font-medium mt-1">Erase</span>
        </button>

        {/* Notes (Pencil Mode) Toggle */}
        <button
          type="button"
          onClick={onToggleNotesMode}
          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer active:scale-95 ${
            isNotesMode
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs'
          }`}
          title="Toggle Notes / Pencil mode (N)"
        >
          <div className="relative">
            <PenLine className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
            <span
              className={`absolute -top-1 -right-4 px-1 py-0.2 text-[9px] font-bold rounded ${
                isNotesMode
                  ? 'bg-white text-indigo-700'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isNotesMode ? 'ON' : 'OFF'}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-medium mt-1">Notes</span>
        </button>

        {/* Smart Hint */}
        <button
          type="button"
          onClick={onTriggerHint}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 active:scale-95 shadow-xs transition-all cursor-pointer"
          title="Get a smart deduction hint (H)"
        >
          <div className="relative">
            <Lightbulb className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2] fill-amber-400/20" />
            {hintsRemaining > 0 && (
              <span className="absolute -top-1 -right-3 px-1 py-0.2 text-[9px] font-bold rounded bg-amber-500 text-white">
                {hintsRemaining}
              </span>
            )}
          </div>
          <span className="text-[11px] sm:text-xs font-medium mt-1">Hint</span>
        </button>
      </div>

      {/* Number Pad (1-9) */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const count = numberCounts[num] || 0;
          const isCompleted = count >= 9;
          const remaining = Math.max(0, 9 - count);

          return (
            <button
              key={num}
              type="button"
              onClick={() => onInputNumber(num)}
              disabled={isCompleted}
              className={`h-13 sm:h-15 flex flex-col items-center justify-center rounded-xl font-bold transition-all cursor-pointer select-none ${
                isCompleted
                  ? 'bg-slate-100/70 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 cursor-default opacity-50'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 active:bg-indigo-50 dark:active:bg-slate-800 shadow-xs'
              }`}
              aria-label={`Digit ${num}, ${remaining} remaining`}
            >
              <span className="text-xl sm:text-2xl leading-none font-bold">{num}</span>
              <span
                className={`text-[9px] sm:text-[10px] font-mono leading-none mt-1 ${
                  isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {isCompleted ? '✓' : remaining}
              </span>
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Prompt */}
      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
        Keyboard: <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">1-9</kbd> input · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">Arrows</kbd> navigate · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">N</kbd> notes · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">Del</kbd> erase · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">Space</kbd> pause
      </p>
    </div>
  );
};
