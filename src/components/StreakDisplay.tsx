import { StreakData } from '../types';
import { format, parseISO } from 'date-fns';

interface StreakDisplayProps {
  streak: StreakData;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const formattedLastEntry = streak.lastEntryDate
    ? format(parseISO(streak.lastEntryDate), 'MMMM d, yyyy')
    : null;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Daily streak</p>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🔥 {streak.currentStreak} days
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-lg font-semibold text-gray-900">{streak.currentStreak}</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-xs text-gray-500">Longest</p>
            <p className="text-lg font-semibold text-gray-900">{streak.longestStreak}</p>
          </div>
        </div>
      </div>
      {streak.currentStreak > 0 ? (
        <p className="mt-3 text-xs text-gray-500">
          Keep showing up! Your last entry was on{' '}
          <span className="font-semibold">{formattedLastEntry ?? '—'}</span>.
        </p>
      ) : (
        <p className="mt-3 text-xs text-gray-500">
          Start your first streak today by adding a diary entry.
        </p>
      )}
    </div>
  );
}

