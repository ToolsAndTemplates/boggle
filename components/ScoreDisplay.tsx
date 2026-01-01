'use client';

interface ScoreDisplayProps {
  score: number;
  wordCount: number;
}

export default function ScoreDisplay({ score, wordCount }: ScoreDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl p-6 backdrop-blur-sm border border-emerald-500/20 shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Score</p>
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {score}
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Words Found</p>
          <p className="text-3xl font-bold text-emerald-400">
            {wordCount}
          </p>
        </div>
      </div>
    </div>
  );
}
