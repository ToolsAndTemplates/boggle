'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from '@/components/GameBoard';
import Timer from '@/components/Timer';
import WordList from '@/components/WordList';
import ScoreDisplay from '@/components/ScoreDisplay';
import {
  generateBoard,
  validatePath,
  pathToWord,
  isValidWord,
  calculateScore,
  Position,
  isAdjacent
} from '@/lib/boggle';

const GAME_DURATION = 180; // 3 minutes

export default function Home() {
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedPath, setSelectedPath] = useState<Position[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [wordScores, setWordScores] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const feedbackTimeout = useRef<NodeJS.Timeout>();

  // Initialize board
  useEffect(() => {
    setBoard(generateBoard(4));
  }, []);

  // Timer
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) {
      if (timeLeft === 0) {
        setIsGameActive(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  // Update current word when path changes
  useEffect(() => {
    if (selectedPath.length > 0 && board.length > 0) {
      setCurrentWord(pathToWord(selectedPath, board));
    } else {
      setCurrentWord('');
    }
  }, [selectedPath, board]);

  const showFeedback = useCallback((message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    if (feedbackTimeout.current) {
      clearTimeout(feedbackTimeout.current);
    }
    feedbackTimeout.current = setTimeout(() => {
      setFeedback(null);
    }, 2000);
  }, []);

  const startGame = () => {
    setBoard(generateBoard(4));
    setFoundWords([]);
    setWordScores([]);
    setTotalScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);
    setGameStarted(true);
    setSelectedPath([]);
    setCurrentWord('');
    setFeedback(null);
  };

  const submitWord = useCallback(() => {
    if (selectedPath.length === 0) return;

    const word = pathToWord(selectedPath, board);

    // Validate path
    if (!validatePath(selectedPath)) {
      showFeedback('Invalid path!', 'error');
      setSelectedPath([]);
      return;
    }

    // Check minimum length
    if (word.length < 3) {
      showFeedback('Word must be at least 3 letters!', 'error');
      setSelectedPath([]);
      return;
    }

    // Check if already found
    if (foundWords.includes(word)) {
      showFeedback('Already found!', 'error');
      setSelectedPath([]);
      return;
    }

    // Check if valid word
    if (!isValidWord(word)) {
      showFeedback('Not a valid word!', 'error');
      setSelectedPath([]);
      return;
    }

    // Add word
    const score = calculateScore(word);
    setFoundWords(prev => [...prev, word]);
    setWordScores(prev => [...prev, score]);
    setTotalScore(prev => prev + score);
    showFeedback(`+${score} points!`, 'success');
    setSelectedPath([]);
  }, [selectedPath, board, foundWords, showFeedback]);

  const handleCellClick = (position: Position) => {
    if (!isGameActive) return;

    const existingIndex = selectedPath.findIndex(
      p => p.row === position.row && p.col === position.col
    );

    if (existingIndex !== -1) {
      // If clicking the last position, remove it
      if (existingIndex === selectedPath.length - 1) {
        setSelectedPath(prev => prev.slice(0, -1));
      }
      // If clicking an earlier position, truncate to that point
      else if (existingIndex < selectedPath.length - 1) {
        setSelectedPath(prev => prev.slice(0, existingIndex + 1));
      }
    } else {
      // Add new position if adjacent or first
      if (selectedPath.length === 0 || isAdjacent(selectedPath[selectedPath.length - 1], position)) {
        setSelectedPath(prev => [...prev, position]);
      }
    }
  };

  const handleMouseEnter = (position: Position) => {
    if (!isGameActive || !isMouseDown) return;

    const existingIndex = selectedPath.findIndex(
      p => p.row === position.row && p.col === position.col
    );

    // Don't add if already in path
    if (existingIndex !== -1) return;

    // Add if adjacent to last position
    if (selectedPath.length === 0 || isAdjacent(selectedPath[selectedPath.length - 1], position)) {
      setSelectedPath(prev => [...prev, position]);
    }
  };

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => {
      setIsMouseDown(false);
      if (selectedPath.length > 0) {
        submitWord();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedPath, submitWord]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isGameActive) return;

      if (e.key === 'Enter' && selectedPath.length > 0) {
        submitWord();
      } else if (e.key === 'Escape') {
        setSelectedPath([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameActive, selectedPath, submitWord]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-pulse-slow">
            BOGGLE
          </h1>
          <p className="text-gray-300 text-lg">
            Find as many words as you can before time runs out!
          </p>
        </div>

        {/* Game Area */}
        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center gap-8 mt-20">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-12 backdrop-blur-sm border border-purple-500/20 shadow-2xl max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">How to Play</h2>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Click and drag to select adjacent letters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Release to submit a word</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Words must be at least 3 letters long</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Longer words earn more points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>You have 3 minutes to find as many words as possible</span>
                </li>
              </ul>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Timer and Score */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <Timer timeLeft={timeLeft} totalTime={GAME_DURATION} />
              </div>
              <ScoreDisplay score={totalScore} wordCount={foundWords.length} />

              {/* Current Word Display */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-xl">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2 text-center">
                  Current Word
                </p>
                <p className="text-3xl font-bold text-center text-purple-300 min-h-[2.5rem]">
                  {currentWord.toUpperCase() || '-'}
                </p>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedPath([])}
                  disabled={!isGameActive || selectedPath.length === 0}
                  className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Clear Selection (Esc)
                </button>
                <button
                  onClick={submitWord}
                  disabled={!isGameActive || selectedPath.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  Submit Word (Enter)
                </button>
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  New Game
                </button>
              </div>
            </div>

            {/* Center Column - Game Board */}
            <div className="flex flex-col items-center justify-start gap-4">
              {board.length > 0 && (
                <GameBoard
                  board={board}
                  selectedPath={selectedPath}
                  onCellClick={handleCellClick}
                  onMouseEnter={handleMouseEnter}
                  isGameActive={isGameActive}
                />
              )}

              {/* Feedback */}
              {feedback && (
                <div
                  className={`px-6 py-3 rounded-lg font-bold text-lg animate-bounce-subtle ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-red-500/20 text-red-300 border border-red-500/50'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {!isGameActive && timeLeft === 0 && (
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-8 backdrop-blur-sm border border-purple-500/50 shadow-2xl text-center animate-bounce-subtle">
                  <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Game Over!
                  </h3>
                  <p className="text-xl text-gray-300 mb-2">Final Score: <span className="font-bold text-emerald-400">{totalScore}</span></p>
                  <p className="text-lg text-gray-400">Words Found: <span className="font-bold text-purple-400">{foundWords.length}</span></p>
                </div>
              )}
            </div>

            {/* Right Column - Word List */}
            <div>
              <WordList words={foundWords} scores={wordScores} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
