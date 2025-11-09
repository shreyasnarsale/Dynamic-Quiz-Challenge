
import React from 'react';
import { QuizHistoryEntry } from '../types';
import { XIcon } from './icons';

interface QuizHistoryModalProps {
  history: QuizHistoryEntry[];
  onClose: () => void;
}

const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({ history, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 id="history-modal-title" className="text-xl font-bold text-cyan-400">Quiz History</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-slate-700 transition"
            aria-label="Close quiz history"
          >
            <XIcon className="w-6 h-6 text-slate-400" />
          </button>
        </header>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-slate-400 text-center">Your quiz history is empty.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((entry, index) => (
                <li key={entry.date + index} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-100 truncate" title={entry.topic}>
                      {entry.topic}
                    </p>
                    <p className="text-sm text-slate-400">
                      {entry.difficulty} &bull; {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-cyan-400">{entry.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryModal;
