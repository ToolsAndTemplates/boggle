'use client';

interface WordListProps {
  words: string[];
  scores: number[];
}

export default function WordList({ words, scores }: WordListProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-xl min-h-[300px] max-h-[500px] overflow-hidden flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Found Words
      </h2>

      {words.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-center">
          <p>Start finding words!<br />Click or drag across letters</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all animate-bounce-subtle"
            >
              <span className="text-lg font-medium text-gray-100">{word.toUpperCase()}</span>
              <span className="text-sm font-bold text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full">
                +{scores[index]}
              </span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
