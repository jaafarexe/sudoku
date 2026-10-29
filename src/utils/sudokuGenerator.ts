import { Difficulty, Grid, SmartHint } from '../types/sudoku';

export type RawBoard = (number | null)[][];

// Helper: Check if placing num at (row, col) is valid in the given raw board
export function isValidPlacement(board: RawBoard, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curR = boxRow + r;
      const curC = boxCol + c;
      if ((curR !== row || curC !== col) && board[curR][curC] === num) return false;
    }
  }
  return true;
}

// Shuffle an array randomly
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Solve board using backtracking and count number of solutions up to maxSolutions
export function countSolutions(board: RawBoard, maxSolutions = 2): number {
  let count = 0;

  function solve(b: RawBoard): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(b, r, c, num)) {
              b[r][c] = num;
              if (solve(b)) {
                // If we found a full board
                // Continue searching to count more
              }
              b[r][c] = null;
              if (count >= maxSolutions) return true;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= maxSolutions;
  }

  const copy = board.map(row => [...row]);
  solve(copy);
  return count;
}

// Generate a complete solved 9x9 Sudoku board
export function generateFullSolution(): number[][] {
  const board: RawBoard = Array(9).fill(null).map(() => Array(9).fill(null));

  // Fill the 3 independent diagonal 3x3 boxes first (0,0), (3,3), (6,6)
  for (let box = 0; box < 9; box += 3) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[box + r][box + c] = nums[idx++];
      }
    }
  }

  // Backtracking solver to fill remaining cells
  function fillRemaining(r = 0, c = 0): boolean {
    if (r === 9) return true;
    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    if (board[r][c] !== null) {
      return fillRemaining(nextR, nextC);
    }

    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of numbers) {
      if (isValidPlacement(board, r, c, num)) {
        board[r][c] = num;
        if (fillRemaining(nextR, nextC)) return true;
        board[r][c] = null;
      }
    }
    return false;
  }

  fillRemaining();
  return board as number[][];
}

// Target clues given per difficulty level
const DIFFICULTY_CLUES: Record<Difficulty, { target: number; min: number }> = {
  easy: { target: 38, min: 36 },
  medium: { target: 32, min: 30 },
  hard: { target: 28, min: 26 },
  expert: { target: 24, min: 22 },
};

export interface GeneratedPuzzle {
  initialGrid: Grid;
  solution: number[][];
  difficulty: Difficulty;
}

export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const fullSolution = generateFullSolution();
  const rawPuzzle: RawBoard = fullSolution.map(row => [...row]);

  // Create list of all 81 cell positions in randomized order
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  const shuffledPositions = shuffle(positions);

  const { target, min } = DIFFICULTY_CLUES[difficulty];
  let cluesCount = 81;

  for (const [r, c] of shuffledPositions) {
    if (cluesCount <= target) break;

    const backup = rawPuzzle[r][c];
    rawPuzzle[r][c] = null;

    // Fast check: verify that puzzle still has a unique solution
    const solutions = countSolutions(rawPuzzle, 2);
    if (solutions !== 1) {
      // Revert if removal creates multiple solutions
      rawPuzzle[r][c] = backup;
    } else {
      cluesCount--;
    }
  }

  // Construct initial Grid state
  const initialGrid: Grid = Array(9).fill(null).map((_, r) =>
    Array(9).fill(null).map((_, c) => ({
      row: r,
      col: c,
      value: rawPuzzle[r][c],
      initial: rawPuzzle[r][c] !== null,
      notes: [],
      error: false,
    }))
  );

  return {
    initialGrid,
    solution: fullSolution,
    difficulty,
  };
}

// Calculate valid candidate numbers for a cell given current board state
export function getCandidates(grid: Grid, row: number, col: number): number[] {
  if (grid[row][col].value !== null) return [];

  const candidates: number[] = [];
  const rawBoard: RawBoard = grid.map(r => r.map(cell => cell.value));

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(rawBoard, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

// Find smart logical hint
export function findSmartHint(grid: Grid, solution: number[][]): SmartHint | null {
  // 1. Look for Naked Single: a cell where only 1 candidate can fit
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value === null) {
        const candidates = getCandidates(grid, r, c);
        if (candidates.length === 1) {
          const val = candidates[0];
          return {
            row: r,
            col: c,
            value: val,
            type: 'naked_single',
            title: 'Naked Single Detected',
            explanation: `Row ${r + 1}, Column ${c + 1} only has one possible candidate: ${val}. All other 8 digits are already present in its row, column, or 3×3 box.`,
          };
        }
      }
    }
  }

  // 2. Look for Hidden Single in rows, columns, or boxes
  // Row check
  for (let r = 0; r < 9; r++) {
    for (let num = 1; num <= 9; num++) {
      const possibleCols: number[] = [];
      for (let c = 0; c < 9; c++) {
        if (grid[r][c].value === null && getCandidates(grid, r, c).includes(num)) {
          possibleCols.push(c);
        }
      }
      if (possibleCols.length === 1) {
        const c = possibleCols[0];
        return {
          row: r,
          col: c,
          value: num,
          type: 'hidden_single',
          title: 'Hidden Single in Row',
          explanation: `In Row ${r + 1}, the number ${num} can only be placed at Column ${c + 1} because other positions are blocked by column or box constraints.`,
        };
      }
    }
  }

  // Column check
  for (let c = 0; c < 9; c++) {
    for (let num = 1; num <= 9; num++) {
      const possibleRows: number[] = [];
      for (let r = 0; r < 9; r++) {
        if (grid[r][c].value === null && getCandidates(grid, r, c).includes(num)) {
          possibleRows.push(r);
        }
      }
      if (possibleRows.length === 1) {
        const r = possibleRows[0];
        return {
          row: r,
          col: c,
          value: num,
          type: 'hidden_single',
          title: 'Hidden Single in Column',
          explanation: `In Column ${c + 1}, the number ${num} can only be placed at Row ${r + 1}.`,
        };
      }
    }
  }

  // 3×3 Box check
  for (let boxR = 0; boxR < 9; boxR += 3) {
    for (let boxC = 0; boxC < 9; boxC += 3) {
      for (let num = 1; num <= 9; num++) {
        const possibleCells: [number, number][] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const curR = boxR + r;
            const curC = boxC + c;
            if (grid[curR][curC].value === null && getCandidates(grid, curR, curC).includes(num)) {
              possibleCells.push([curR, curC]);
            }
          }
        }
        if (possibleCells.length === 1) {
          const [r, c] = possibleCells[0];
          return {
            row: r,
            col: c,
            value: num,
            type: 'hidden_single',
            title: 'Hidden Single in 3×3 Box',
            explanation: `In this 3×3 box, the number ${num} can only fit in Row ${r + 1}, Column ${c + 1}.`,
          };
        }
      }
    }
  }

  // 3. Fallback: Find cell with fewest candidates or first empty cell with solution
  let bestCell: { r: number; c: number; candidateCount: number } | null = null;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value === null) {
        const candidates = getCandidates(grid, r, c);
        if (!bestCell || candidates.length < bestCell.candidateCount) {
          bestCell = { r, c, candidateCount: candidates.length };
        }
      }
    }
  }

  if (bestCell) {
    const { r, c } = bestCell;
    const val = solution[r][c];
    return {
      row: r,
      col: c,
      value: val,
      type: 'solution',
      title: 'Deduction Clue',
      explanation: `By checking the row, column, and block interactions, the correct number for Row ${r + 1}, Column ${c + 1} is ${val}.`,
    };
  }

  return null;
}
