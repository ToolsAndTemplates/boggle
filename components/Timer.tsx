'use client';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export default function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= 30;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className={`transition-all duration-1000 ${
              isLowTime
                ? 'text-red-500 animate-pulse-slow'
                : 'text-emerald-500'
            }`}
            strokeLinecap="round"
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${isLowTime ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {isLowTime && timeLeft > 0 && (
        <span className="text-red-400 text-sm font-semibold animate-pulse">
          Hurry up!
        </span>
      )}
    </div>
  );
}
