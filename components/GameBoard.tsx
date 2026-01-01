'use client';

import { Position } from '@/lib/boggle';

interface GameBoardProps {
  board: string[][];
  selectedPath: Position[];
  onCellClick: (position: Position) => void;
  onMouseEnter: (position: Position) => void;
  isGameActive: boolean;
}

export default function GameBoard({
  board,
  selectedPath,
  onCellClick,
  onMouseEnter,
  isGameActive
}: GameBoardProps) {
  const isSelected = (row: number, col: number): boolean => {
    return selectedPath.some(pos => pos.row === row && pos.col === col);
  };

  const getSelectionIndex = (row: number, col: number): number => {
    return selectedPath.findIndex(pos => pos.row === row && pos.col === col);
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl backdrop-blur-sm border border-purple-500/20 shadow-2xl">
      {board.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const selected = isSelected(rowIndex, colIndex);
          const selectionIndex = getSelectionIndex(rowIndex, colIndex);

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative w-20 h-20 text-3xl font-bold rounded-xl
                transition-all duration-200 transform
                ${selected
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105 shadow-lg shadow-purple-500/50 z-10'
                  : 'bg-gradient-to-br from-slate-700 to-slate-800 text-gray-100 hover:scale-110 hover:shadow-lg hover:from-slate-600 hover:to-slate-700'
                }
                ${!isGameActive && 'opacity-50 cursor-not-allowed'}
                border-2 ${selected ? 'border-white' : 'border-slate-600'}
                active:scale-95
              `}
              onClick={() => isGameActive && onCellClick({ row: rowIndex, col: colIndex })}
              onMouseEnter={() => isGameActive && onMouseEnter({ row: rowIndex, col: colIndex })}
              disabled={!isGameActive}
            >
              {letter}
              {selected && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-purple-600 text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {selectionIndex + 1}
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
