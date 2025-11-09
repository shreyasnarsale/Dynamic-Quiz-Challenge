
import React from 'react';
import { LeaderboardEntry } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
    const rankColors: { [key: number]: string } = {
        1: 'text-yellow-400',
        2: 'text-slate-300',
        3: 'text-yellow-600',
    };

  return (
    <div className="mt-6 w-full text-left">
      <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        <TrophyIcon className="w-6 h-6 text-yellow-400" />
        Top 5 Leaderboard
      </h3>
      {leaderboard.length === 0 ? (
        <p className="text-slate-400 text-center bg-slate-700/50 p-4 rounded-lg">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div key={entry.date + entry.name} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-4">
                <span className={`font-bold text-lg w-6 text-center ${rankColors[index + 1] || 'text-slate-400'}`}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-100">{entry.name}</p>
                  <p className="text-xs text-slate-400">
                    {entry.topic} ({entry.difficulty})
                  </p>
                </div>
              </div>
              <span className="font-bold text-xl text-cyan-400">{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
