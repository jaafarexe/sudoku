import React from 'react';
import { X, Volume2, AlertOctagon, Sparkles, Eye, Grid } from 'lucide-react';
import { GameSettings } from '../types/sudoku';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleItems: {
    key: keyof GameSettings;
    title: string;
    desc: string;
    icon: React.ElementType;
  }[] = [
    {
      key: 'soundEnabled',
      title: 'Sound Effects',
      desc: 'Play subtle audio feedback for moves, mistakes, and victory.',
      icon: Volume2,
    },
    {
      key: 'mistakeLimitEnabled',
      title: '3 Mistakes Limit',
      desc: 'Game ends if you make 3 incorrect number placements.',
      icon: AlertOctagon,
    },
    {
      key: 'autoClearNotes',
      title: 'Auto-Clear Notes',
      desc: 'Automatically remove candidates from row, column, and box when a number is placed.',
      icon: Sparkles,
    },
    {
      key: 'highlightMatchingNumbers',
      title: 'Highlight Matching Digits',
      desc: 'Highlight all cells across the grid that share the selected number.',
      icon: Eye,
    },
    {
      key: 'highlightRelatedCells',
      title: 'Highlight Row, Col & Box',
      desc: 'Gently highlight the row, column, and 3×3 square of the selected cell.',
      icon: Grid,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Game Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your Sudoku Master experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 my-2">
          {toggleItems.map((item) => {
            const Icon = item.icon;
            const isChecked = settings[item.key];

            return (
              <div
                key={item.key}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  onClick={() =>
                    onUpdateSettings({ [item.key]: !isChecked })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isChecked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isChecked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
