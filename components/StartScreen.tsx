
import React, { useState } from 'react';
import { Difficulty, UserProfile, QuizHistoryEntry } from '../types';
import { LoaderIcon, HistoryIcon } from './icons';
import QuizHistoryModal from './QuizHistoryModal';

interface StartScreenProps {
  onStartQuiz: (topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
  quizHistory: QuizHistoryEntry[];
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartQuiz, isLoading, error, userProfile, quizHistory }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setFormError('Please enter a topic to start the quiz.');
      return;
    }
    setFormError(null);
    onStartQuiz(topic, difficulty);
  };

  return (
    <>
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl animate-fadeIn">
        {userProfile && (
          <div className="text-center mb-4 flex items-center justify-center gap-4">
            <p className="text-lg text-cyan-400">
              Welcome back, {userProfile.name}!
            </p>
            {quizHistory.length > 0 && (
                <button 
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition"
                  aria-label="View quiz history"
                >
                  <HistoryIcon className="w-4 h-4" />
                  History
                </button>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
              What do you want to be quizzed on?
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Ancient Rome or ReactJS"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              disabled={isLoading}
            />
            {formError && <p className="text-red-400 text-sm mt-2">{formError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Difficulty
            </label>
            <div className="grid grid-cols-3 gap-4">
              {Object.values(Difficulty).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-fuchsia-500 ${
                    difficulty === level
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  disabled={isLoading}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-fuchsia-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Generating Quiz...
              </>
            ) : (
              'Start Quiz'
            )}
          </button>
        </form>
      </div>
      {isHistoryModalOpen && <QuizHistoryModal history={quizHistory} onClose={() => setIsHistoryModalOpen(false)} />}
    </>
  );
};

export default StartScreen;
