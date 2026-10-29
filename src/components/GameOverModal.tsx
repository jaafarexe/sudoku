import React from 'react';
import { AlertTriangle, RotateCcw, Plus, HeartHandshake } from 'lucide-react';
import { Difficulty } from '../types/sudoku';

interface GameOverModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  difficulty: Difficulty;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRestart,
  onNewGame,
  onContinue,
  difficulty,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center transition-all">
        {/* Alert Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Mistake Limit Reached
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          You made 3 mistakes in this game. Would you like to try again or continue with an extra life?
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Continue Playing (+1 Life)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Current Puzzle</span>
          </button>

          <button
            onClick={onNewGame}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};
