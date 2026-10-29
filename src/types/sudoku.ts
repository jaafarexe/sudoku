export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  value: number | null;
  initial: boolean;
  notes: number[];
  error: boolean;
}

export type Grid = CellData[][];

export interface MoveHistory {
  row: number;
  col: number;
  prevValue: number | null;
  newValue: number | null;
  prevNotes: number[];
  newNotes: number[];
}

export interface DifficultyStats {
  played: number;
  won: number;
  bestTimeSeconds: number | null;
  totalTimeSeconds: number;
  currentStreak: number;
  bestStreak: number;
}

export type AllStats = Record<Difficulty, DifficultyStats>;

export interface GameSettings {
  soundEnabled: boolean;
  mistakeLimitEnabled: boolean;
  autoClearNotes: boolean;
  highlightMatchingNumbers: boolean;
  highlightRelatedCells: boolean;
}

export interface SmartHint {
  row: number;
  col: number;
  value: number;
  type: 'naked_single' | 'hidden_single' | 'candidate_elimination' | 'solution';
  title: string;
  explanation: string;
}
