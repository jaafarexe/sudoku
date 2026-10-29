import { AllStats, Difficulty, GameSettings, Grid } from '../types/sudoku';

const STATS_KEY = 'sudoku_master_stats_v1';
const SETTINGS_KEY = 'sudoku_master_settings_v1';
const SAVED_GAME_KEY = 'sudoku_master_active_game_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  mistakeLimitEnabled: true,
  autoClearNotes: true,
  highlightMatchingNumbers: true,
  highlightRelatedCells: true,
};

const DEFAULT_DIFFICULTY_STATS = {
  played: 0,
  won: 0,
  bestTimeSeconds: null,
  totalTimeSeconds: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export const DEFAULT_ALL_STATS: AllStats = {
  easy: { ...DEFAULT_DIFFICULTY_STATS },
  medium: { ...DEFAULT_DIFFICULTY_STATS },
  hard: { ...DEFAULT_DIFFICULTY_STATS },
  expert: { ...DEFAULT_DIFFICULTY_STATS },
};

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadStats(): AllStats {
  if (typeof window === 'undefined') return DEFAULT_ALL_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_ALL_STATS;
    return { ...DEFAULT_ALL_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ALL_STATS;
  }
}

export function recordGameResult(difficulty: Difficulty, won: boolean, timeSeconds: number): AllStats {
  const allStats = loadStats();
  const current = allStats[difficulty] || { ...DEFAULT_DIFFICULTY_STATS };

  const played = current.played + 1;
  const wonCount = current.won + (won ? 1 : 0);
  const totalTime = current.totalTimeSeconds + timeSeconds;
  let bestTime = current.bestTimeSeconds;
  let currentStreak = current.currentStreak;
  let bestStreak = current.bestStreak;

  if (won) {
    if (bestTime === null || timeSeconds < bestTime) {
      bestTime = timeSeconds;
    }
    currentStreak += 1;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
  } else {
    currentStreak = 0;
  }

  allStats[difficulty] = {
    played,
    won: wonCount,
    bestTimeSeconds: bestTime,
    totalTimeSeconds: totalTime,
    currentStreak,
    bestStreak,
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
  } catch {}

  return allStats;
}

export interface SavedGame {
  grid: Grid;
  solution: number[][];
  difficulty: Difficulty;
  timeSeconds: number;
  mistakes: number;
  hintsUsed: number;
}

export function saveActiveGame(game: SavedGame | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!game) {
      localStorage.removeItem(SAVED_GAME_KEY);
    } else {
      localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(game));
    }
  } catch {}
}

export function loadActiveGame(): SavedGame | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVED_GAME_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${paddedMins}:${paddedSecs}`;
}
