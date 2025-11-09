
import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardEntry, Difficulty } from '../types';
import Leaderboard from './Leaderboard';

interface ResultsScreenProps {
  score: number;
  onPlayAgain: () => void;
  onSaveToLeaderboard: (name: string) => void;
  userProfile: UserProfile | null;
  leaderboard: LeaderboardEntry[];
  topic: string;
  difficulty: Difficulty;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  score, 
  onPlayAgain, 
  onSaveToLeaderboard, 
  userProfile,
  leaderboard,
  topic,
  difficulty,
}) => {
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (userProfile?.name) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSaveToLeaderboard(name.trim());
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl text-center animate-fadeIn">
      <h2 className="text-3xl font-bold text-cyan-400 mb-2">Quiz Complete!</h2>
      <p className="text-slate-300 mb-4">You finished the "{topic}" quiz on {difficulty} difficulty.</p>
      <p className="text-5xl font-bold my-6">{score}</p>
      <p className="text-slate-400">Final Score</p>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="mt-8 mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full sm:w-auto flex-grow bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105"
          >
            Save to Leaderboard
          </button>
        </form>
      ) : (
        <p className="text-green-400 my-8">Score saved! See your rank below.</p>
      )}
      
      <Leaderboard leaderboard={leaderboard} />

      <button
        onClick={onPlayAgain}
        className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-fuchsia-600 transition-transform transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultsScreen;
