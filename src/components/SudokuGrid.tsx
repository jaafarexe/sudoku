import React from 'react';
import { Grid, CellPosition, SmartHint } from '../types/sudoku';
import { Play } from 'lucide-react';

interface SudokuGridProps {
  grid: Grid;
  selectedCell: CellPosition | null;
  onSelectCell: (row: number, col: number) => void;
  highlightMatchingNumbers: boolean;
  highlightRelatedCells: boolean;
  activeHint: SmartHint | null;
  isPaused: boolean;
  onResume: () => void;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  selectedCell,
  onSelectCell,
  highlightMatchingNumbers,
  highlightRelatedCells,
  activeHint,
  isPaused,
  onResume,
}) => {
  const selectedValue =
    selectedCell && grid[selectedCell.row][selectedCell.col].value !== null
      ? grid[selectedCell.row][selectedCell.col].value
      : null;

  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      {/* 9x9 Board Container */}
      <div
        className="w-full aspect-square grid grid-cols-9 border-2 border-slate-900 dark:border-slate-300 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-black/40 transition-colors"
        role="grid"
        aria-label="Sudoku Board"
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;

            // Related cells: same row, same column, or same 3x3 block
            const isSameRow = selectedCell?.row === r;
            const isSameCol = selectedCell?.col === c;
            const isSameBox =
              selectedCell &&
              Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
              Math.floor(selectedCell.col / 3) === Math.floor(c / 3);

            const isRelated = highlightRelatedCells && (isSameRow || isSameCol || isSameBox);

            // Same value match
            const isMatchingValue =
              highlightMatchingNumbers &&
              selectedValue !== null &&
              cell.value === selectedValue;

            // Hint highlight
            const isHintTarget = activeHint?.row === r && activeHint?.col === c;

            // Box boundary borders
            const isBoxRight = c === 2 || c === 5;
            const isBoxBottom = r === 2 || r === 5;

            // Compute background and styling
            let bgClass = 'bg-white dark:bg-slate-900';
            if (cell.error) {
              bgClass = 'bg-red-100 dark:bg-red-950/70';
            } else if (isSelected) {
              bgClass = 'bg-indigo-100/90 dark:bg-indigo-900/60 ring-2 ring-indigo-500 z-10';
            } else if (isHintTarget) {
              bgClass = 'bg-amber-100/90 dark:bg-amber-950/70 ring-2 ring-amber-500 z-10 animate-pulse';
            } else if (isMatchingValue) {
              bgClass = 'bg-indigo-100 dark:bg-indigo-950/50';
            } else if (isRelated) {
              bgClass = 'bg-slate-100/70 dark:bg-slate-800/40';
            }

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => onSelectCell(r, c)}
                className={`relative aspect-square flex items-center justify-center text-lg sm:text-2xl font-bold transition-colors cursor-pointer outline-none ${bgClass} ${
                  isBoxRight
                    ? 'border-r-2 border-slate-800 dark:border-slate-300'
                    : c < 8
                    ? 'border-r border-slate-200 dark:border-slate-800'
                    : ''
                } ${
                  isBoxBottom
                    ? 'border-b-2 border-slate-800 dark:border-slate-300'
                    : r < 8
                    ? 'border-b border-slate-200 dark:border-slate-800'
                    : ''
                }`}
                aria-label={`Row ${r + 1}, Column ${c + 1}: ${
                  cell.value ? `Value ${cell.value}` : 'Empty'
                }`}
              >
                {cell.value !== null ? (
                  <span
                    className={`${
                      cell.error
                        ? 'text-red-600 dark:text-red-400'
                        : cell.initial
                        ? 'text-slate-900 dark:text-slate-50 font-black'
                        : 'text-indigo-600 dark:text-indigo-400 font-bold'
                    } ${isMatchingValue && !cell.error ? 'scale-105' : ''} transition-transform`}
                  >
                    {cell.value}
                  </span>
                ) : (
                  // Notes (Pencil Marks) mini 3x3 grid
                  <div className="w-full h-full p-0.5 sm:p-1 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((noteNum) => {
                      const hasNote = cell.notes.includes(noteNum);
                      const isMatchingNote = selectedValue === noteNum;
                      return (
                        <div
                          key={noteNum}
                          className={`flex items-center justify-center text-[9px] sm:text-[11px] font-semibold leading-none font-mono ${
                            hasNote
                              ? isMatchingNote
                                ? 'text-indigo-600 dark:text-indigo-300 font-bold bg-indigo-200/50 dark:bg-indigo-900/50 rounded-sm'
                                : 'text-slate-500 dark:text-slate-400'
                              : 'invisible'
                          }`}
                        >
                          {noteNum}
                        </div>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Paused Frosted Overlay */}
      {isPaused && (
        <div className="absolute inset-0 rounded-xl bg-white/75 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center gap-3.5 z-20 transition-all">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-full text-indigo-600 dark:text-indigo-400">
            <Play className="w-7 h-7 fill-current ml-0.5" />
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Game Paused
          </p>
          <button
            onClick={onResume}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
          >
            Resume Game
          </button>
        </div>
      )}
    </div>
  );
};
