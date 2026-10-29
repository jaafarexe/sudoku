import React from 'react';
import { Pause, Play, AlertCircle, RotateCcw } from 'lucide-react';
import { Difficulty } from '../types/sudoku';
import { formatTime } from '../utils/storage';

interface GameHUDProps {
  difficulty: Difficulty;
  mistakes: number;
  maxMistakes: number;
  mistakeLimitEnabled: boolean;
  seconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestartCurrent: () => void;
  onChangeDifficulty: () => void;
}

const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export const GameHUD: React.FC<GameHUDProps> = ({
  difficulty,
  mistakes,
  maxMistakes,
  mistakeLimitEnabled,
  seconds,
  isPaused,
  onTogglePause,
  onRestartCurrent,
  onChangeDifficulty,
}) => {
  return (
    <div className="w-full flex items-center justify-between py-2.5 px-2 border-b border-slate-200/80 dark:border-slate-800/80 text-sm">
      {/* Difficulty selector button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onChangeDifficulty}
          className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          title="Change difficulty"
        >
          <span>{DIFFICULTY_NAMES[difficulty]}</span>
          <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 lowercase">
            (change)
          </span>
        </button>
      </div>

      {/* Mistakes Tracker */}
      <div className="flex items-center gap-1 text-xs sm:text-sm font-medium">
        <span className="text-slate-500 dark:text-slate-400">Mistakes:</span>
        {mistakeLimitEnabled ? (
          <span
            className={`font-semibold tabular-nums ${
              mistakes >= maxMistakes
                ? 'text-red-600 dark:text-red-400'
                : mistakes > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {mistakes}/{maxMistakes}
          </span>
        ) : (
          <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300">
            {mistakes}
          </span>
        )}
        {mistakes > 0 && mistakes >= maxMistakes - 1 && (
          <AlertCircle className="w-3.5 h-3.5 text-red-500 inline ml-0.5 animate-pulse" />
        )}
      </div>

      {/* Timer & Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-mono text-sm sm:text-base font-semibold tabular-nums">
          <span>{formatTime(seconds)}</span>
          <button
            onClick={onTogglePause}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={onRestartCurrent}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Restart this puzzle"
          aria-label="Restart this puzzle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
