import React from 'react';
import { Volume2, VolumeX, BarChart3, Settings, HelpCircle, Plus } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onOpenNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenStats,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenNewGame,
}) => {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm shadow-indigo-500/20">
            9
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            Sudoku Master
          </span>
        </div>

        {/* Zone 2: Navigation / Secondary utilities */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-60" />}
          </button>

          <button
            onClick={onOpenStats}
            title="Statistics"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            title="How to Play"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0">
          <button
            onClick={onOpenNewGame}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
