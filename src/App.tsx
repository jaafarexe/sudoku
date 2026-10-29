/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { GameHUD } from './components/GameHUD';
import { SudokuGrid } from './components/SudokuGrid';
import { Controls } from './components/Controls';
import { SmartHintModal } from './components/SmartHintModal';
import { WinModal } from './components/WinModal';
import { GameOverModal } from './components/GameOverModal';
import { NewGameModal } from './components/NewGameModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';

import {
  Difficulty,
  CellPosition,
  Grid,
  MoveHistory,
  GameSettings,
  SmartHint,
} from './types/sudoku';
import {
  generatePuzzle,
  findSmartHint,
  GeneratedPuzzle,
} from './utils/sudokuGenerator';
import { soundManager } from './utils/soundEffects';
import {
  loadSettings,
  saveSettings,
  loadStats,
  recordGameResult,
  loadActiveGame,
  saveActiveGame,
} from './utils/storage';

export default function App() {
  // Settings & Audio
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [stats, setStats] = useState(() => loadStats());

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    saveSettings(settings);
  }, [settings]);

  // Game Puzzle State
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [grid, setGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [history, setHistory] = useState<MoveHistory[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isNewBestTime, setIsNewBestTime] = useState<boolean>(false);

  // Hints
  const [activeHint, setActiveHint] = useState<SmartHint | null>(null);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);

  // Modals
  const [isNewGameOpen, setIsNewGameOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  // Initialize or resume game
  const initNewPuzzle = useCallback((targetDifficulty: Difficulty) => {
    const puzzle: GeneratedPuzzle = generatePuzzle(targetDifficulty);
    setDifficulty(targetDifficulty);
    setGrid(puzzle.initialGrid);
    setInitialGrid(puzzle.initialGrid.map((r) => r.map((c) => ({ ...c }))));
    setSolution(puzzle.solution);
    setSelectedCell({ row: 0, col: 0 });
    setIsNotesMode(false);
    setHistory([]);
    setMistakes(0);
    setHintsUsed(0);
    setSeconds(0);
    setIsPaused(false);
    setIsGameOver(false);
    setIsWon(false);
    setIsNewBestTime(false);
    setActiveHint(null);
    setIsHintModalOpen(false);
    setIsNewGameOpen(false);

    saveActiveGame(null);
  }, []);

  const restartCurrentPuzzle = useCallback(() => {
    if (initialGrid.length === 0) return;
    setGrid(initialGrid.map((r) => r.map((c) => ({ ...c }))));
    setHistory([]);
    setMistakes(0);
    setHintsUsed(0);
    setSeconds(0);
    setIsPaused(false);
    setIsGameOver(false);
    setIsWon(false);
    setActiveHint(null);
    setIsHintModalOpen(false);
    setIsNewGameOpen(false);
  }, [initialGrid]);

  // Load saved game on first mount or generate new
  useEffect(() => {
    const saved = loadActiveGame();
    if (saved && saved.grid.length === 9) {
      setGrid(saved.grid);
      setSolution(saved.solution);
      setDifficulty(saved.difficulty);
      setMistakes(saved.mistakes);
      setHintsUsed(saved.hintsUsed);
      setSeconds(saved.timeSeconds);
      // Construct initialGrid by filtering initial cells
      const reconstructedInitial = saved.grid.map((r) =>
        r.map((c) => ({
          ...c,
          value: c.initial ? c.value : null,
          error: false,
          notes: [],
        }))
      );
      setInitialGrid(reconstructedInitial);
      setSelectedCell({ row: 0, col: 0 });
    } else {
      initNewPuzzle('medium');
    }
  }, [initNewPuzzle]);

  // Timer interval
  useEffect(() => {
    if (isPaused || isGameOver || isWon || grid.length === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isGameOver, isWon, grid]);

  // Save active game to localStorage periodically
  useEffect(() => {
    if (grid.length === 9 && !isWon && !isGameOver) {
      saveActiveGame({
        grid,
        solution,
        difficulty,
        timeSeconds: seconds,
        mistakes,
        hintsUsed,
      });
    }
  }, [grid, solution, difficulty, seconds, mistakes, hintsUsed, isWon, isGameOver]);

  // Check Win Condition
  const checkWinCondition = useCallback(
    (currentGrid: Grid): boolean => {
      if (solution.length === 0) return false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = currentGrid[r][c];
          if (cell.value === null || cell.value !== solution[r][c] || cell.error) {
            return false;
          }
        }
      }
      return true;
    },
    [solution]
  );

  // Input a number into the selected cell
  const handleInputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || isPaused || isGameOver || isWon) return;
      const { row, col } = selectedCell;
      const targetCell = grid[row][col];

      // Cannot modify initial given numbers
      if (targetCell.initial) return;

      if (isNotesMode) {
        // Toggle notes candidate
        const newNotes = targetCell.notes.includes(num)
          ? targetCell.notes.filter((n) => n !== num)
          : [...targetCell.notes, num].sort((a, b) => a - b);

        setHistory((prev) => [
          ...prev,
          {
            row,
            col,
            prevValue: targetCell.value,
            newValue: targetCell.value,
            prevNotes: [...targetCell.notes],
            newNotes,
          },
        ]);

        const nextGrid = grid.map((r, rIdx) =>
          rIdx === row
            ? r.map((c, cIdx) => (cIdx === col ? { ...c, notes: newNotes } : c))
            : r
        );

        setGrid(nextGrid);
        soundManager.playNoteToggled();
        return;
      }

      // Normal mode input
      // If user inputs the exact same value that's already in the cell, ignore or clear
      if (targetCell.value === num && !targetCell.error) return;

      const isCorrect = solution[row][col] === num;

      // Handle mistake
      if (!isCorrect) {
        soundManager.playMistake();
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);

        // Put error in the cell
        const nextGrid = grid.map((r, rIdx) =>
          rIdx === row
            ? r.map((c, cIdx) =>
                cIdx === col
                  ? { ...c, value: num, error: true }
                  : c
              )
            : r
        );
        setGrid(nextGrid);

        // Check if mistakes limit is enabled and exceeded
        if (settings.mistakeLimitEnabled && nextMistakes >= 3) {
          setIsGameOver(true);
        }
        return;
      }

      // Valid correct number placed!
      soundManager.playNumberPlaced();

      // Clear active hint if this was the hinted cell
      if (activeHint?.row === row && activeHint?.col === col) {
        setActiveHint(null);
      }

      // Auto-clear notes from row, col, and 3x3 block if setting enabled
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;

      const nextGrid = grid.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {
              ...c,
              value: num,
              error: false,
              notes: [],
            };
          }

          if (settings.autoClearNotes && c.notes.includes(num)) {
            const isSameRow = rIdx === row;
            const isSameCol = cIdx === col;
            const isSameBox =
              rIdx >= boxRow &&
              rIdx < boxRow + 3 &&
              cIdx >= boxCol &&
              cIdx < boxCol + 3;

            if (isSameRow || isSameCol || isSameBox) {
              return {
                ...c,
                notes: c.notes.filter((n) => n !== num),
              };
            }
          }

          return c;
        })
      );

      setHistory((prev) => [
        ...prev,
        {
          row,
          col,
          prevValue: targetCell.value,
          newValue: num,
          prevNotes: [...targetCell.notes],
          newNotes: [],
        },
      ]);

      setGrid(nextGrid);

      // Check for victory
      if (checkWinCondition(nextGrid)) {
        setIsWon(true);
        soundManager.playVictory();
        saveActiveGame(null);

        const currentBest = stats[difficulty].bestTimeSeconds;
        const newRecord = currentBest === null || seconds < currentBest;
        setIsNewBestTime(newRecord);

        const updatedStats = recordGameResult(difficulty, true, seconds);
        setStats(updatedStats);
      }
    },
    [
      selectedCell,
      isPaused,
      isGameOver,
      isWon,
      grid,
      isNotesMode,
      solution,
      mistakes,
      settings,
      activeHint,
      checkWinCondition,
      difficulty,
      seconds,
      stats,
    ]
  );

  // Erase cell content
  const handleErase = useCallback(() => {
    if (!selectedCell || isPaused || isGameOver || isWon) return;
    const { row, col } = selectedCell;
    const cell = grid[row][col];

    if (cell.initial) return;
    if (cell.value === null && cell.notes.length === 0) return;

    soundManager.playErase();

    setHistory((prev) => [
      ...prev,
      {
        row,
        col,
        prevValue: cell.value,
        newValue: null,
        prevNotes: [...cell.notes],
        newNotes: [],
      },
    ]);

    const nextGrid = grid.map((r, rIdx) =>
      rIdx === row
        ? r.map((c, cIdx) =>
            cIdx === col ? { ...c, value: null, error: false, notes: [] } : c
          )
        : r
    );

    setGrid(nextGrid);
  }, [selectedCell, isPaused, isGameOver, isWon, grid]);

  // Undo last action
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isPaused || isGameOver || isWon) return;

    const lastMove = history[history.length - 1];
    const { row, col, prevValue, prevNotes } = lastMove;

    soundManager.playErase();

    const nextGrid = grid.map((r, rIdx) =>
      rIdx === row
        ? r.map((c, cIdx) =>
            cIdx === col
              ? {
                  ...c,
                  value: prevValue,
                  error: false,
                  notes: [...prevNotes],
                }
              : c
          )
        : r
    );

    setGrid(nextGrid);
    setHistory((prev) => prev.slice(0, -1));
    setSelectedCell({ row, col });
  }, [history, isPaused, isGameOver, isWon, grid]);

  // Smart Hint Request
  const handleTriggerHint = useCallback(() => {
    if (isPaused || isGameOver || isWon || grid.length === 0) return;

    const hint = findSmartHint(grid, solution);
    if (!hint) return;

    soundManager.playHint();
    setActiveHint(hint);
    setSelectedCell({ row: hint.row, col: hint.col });
    setIsHintModalOpen(true);
    setHintsUsed((prev) => prev + 1);
  }, [isPaused, isGameOver, isWon, grid, solution]);

  // Apply Hint automatically from modal
  const handleApplyHint = useCallback(() => {
    if (!activeHint) return;
    const { row, col, value } = activeHint;
    setIsHintModalOpen(false);
    setSelectedCell({ row, col });
    setIsNotesMode(false);
    handleInputNumber(value);
  }, [activeHint, handleInputNumber]);

  // Count placed instances of digits 1-9 across grid
  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };
    if (grid.length === 0) return counts;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c].value;
        if (val !== null && !grid[r][c].error) {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
    }
    return counts;
  }, [grid]);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes if a modal is open
      if (
        isHintModalOpen ||
        isNewGameOpen ||
        isStatsOpen ||
        isSettingsOpen ||
        isHowToPlayOpen ||
        isWon ||
        isGameOver
      ) {
        return;
      }

      // Spacebar to pause/unpause
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused) return;

      // Digits 1-9
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        handleInputNumber(parseInt(e.key, 10));
        return;
      }

      // Erase
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleErase();
        return;
      }

      // Notes mode toggle
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNotesMode((prev) => !prev);
        return;
      }

      // Undo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Hint
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleTriggerHint();
        return;
      }

      // Arrow keys navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setSelectedCell((prev) => {
          if (!prev) return { row: 0, col: 0 };
          let nextRow = prev.row;
          let nextCol = prev.col;
          if (e.key === 'ArrowUp') nextRow = Math.max(0, prev.row - 1);
          if (e.key === 'ArrowDown') nextRow = Math.min(8, prev.row + 1);
          if (e.key === 'ArrowLeft') nextCol = Math.max(0, prev.col - 1);
          if (e.key === 'ArrowRight') nextCol = Math.min(8, prev.col + 1);
          return { row: nextRow, col: nextCol };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isHintModalOpen,
    isNewGameOpen,
    isStatsOpen,
    isSettingsOpen,
    isHowToPlayOpen,
    isWon,
    isGameOver,
    isPaused,
    handleInputNumber,
    handleErase,
    handleUndo,
    handleTriggerHint,
  ]);

  // Next level sequence
  const handleNextDifficulty = () => {
    setIsWon(false);
    const order: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const curIdx = order.indexOf(difficulty);
    const nextDiff = order[Math.min(order.length - 1, curIdx + 1)];
    initNewPuzzle(nextDiff);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenNewGame={() => setIsNewGameOpen(true)}
      />

      {/* Main Playing Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex flex-col items-center justify-between">
        {/* Game HUD (Difficulty, Mistakes, Timer) */}
        <GameHUD
          difficulty={difficulty}
          mistakes={mistakes}
          maxMistakes={3}
          mistakeLimitEnabled={settings.mistakeLimitEnabled}
          seconds={seconds}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          onRestartCurrent={restartCurrentPuzzle}
          onChangeDifficulty={() => setIsNewGameOpen(true)}
        />

        {/* 9x9 Sudoku Grid */}
        <div className="w-full my-auto py-2">
          {grid.length === 9 ? (
            <SudokuGrid
              grid={grid}
              selectedCell={selectedCell}
              onSelectCell={(r, c) => {
                if (!isPaused) {
                  setSelectedCell({ row: r, col: c });
                }
              }}
              highlightMatchingNumbers={settings.highlightMatchingNumbers}
              highlightRelatedCells={settings.highlightRelatedCells}
              activeHint={activeHint}
              isPaused={isPaused}
              onResume={() => setIsPaused(false)}
            />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center">
              <span className="text-sm text-slate-400">Loading puzzle...</span>
            </div>
          )}
        </div>

        {/* Tactile Controls & Keypad */}
        <Controls
          isNotesMode={isNotesMode}
          onToggleNotesMode={() => setIsNotesMode((prev) => !prev)}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          onErase={handleErase}
          onTriggerHint={handleTriggerHint}
          hintsRemaining={3 - hintsUsed > 0 ? 3 - hintsUsed : 0}
          onInputNumber={handleInputNumber}
          numberCounts={numberCounts}
        />
      </main>

      {/* Modals */}
      <SmartHintModal
        hint={activeHint}
        onClose={() => setIsHintModalOpen(false)}
        onApplyHint={handleApplyHint}
      />

      <WinModal
        isOpen={isWon}
        onClose={() => setIsWon(false)}
        difficulty={difficulty}
        timeSeconds={seconds}
        isNewBestTime={isNewBestTime}
        mistakes={mistakes}
        hintsUsed={hintsUsed}
        onPlayAgain={() => initNewPuzzle(difficulty)}
        onNextDifficulty={handleNextDifficulty}
      />

      <GameOverModal
        isOpen={isGameOver}
        difficulty={difficulty}
        onRestart={restartCurrentPuzzle}
        onNewGame={() => {
          setIsGameOver(false);
          setIsNewGameOpen(true);
        }}
        onContinue={() => {
          setIsGameOver(false);
          setMistakes(2); // Provide 1 extra life
        }}
      />

      <NewGameModal
        isOpen={isNewGameOpen}
        onClose={() => setIsNewGameOpen(false)}
        onSelectDifficulty={(diff) => initNewPuzzle(diff)}
        onRestartCurrent={restartCurrentPuzzle}
        currentDifficulty={difficulty}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) =>
          setSettings((prev) => ({ ...prev, ...newVals }))
        }
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
