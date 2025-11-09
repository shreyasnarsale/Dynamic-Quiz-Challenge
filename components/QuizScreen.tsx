
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizQuestion, Difficulty } from '../types';
import { DIFFICULTY_SETTINGS } from '../constants';
import Timer from './Timer';
import { CheckIcon, XIcon, LightbulbIcon } from './icons';

interface QuizScreenProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onTimeUp: () => void;
  onNextQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  difficulty: Difficulty;
}

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const progress = (value / max) * 100;
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <div
        className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  onAnswer,
  onTimeUp,
  onNextQuestion,
  questionNumber,
  totalQuestions,
  score,
  difficulty,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackClass, setFeedbackClass] = useState('');

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedbackClass('');
  }, [question]);

  const handleAnswerClick = useCallback((index: number) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(index);
    const isCorrect = index === question.correctAnswerIndex;
    
    if (isCorrect) {
      setFeedbackClass('animate-pulse');
    } else {
      setFeedbackClass('animate-shake');
    }
    
    onAnswer(isCorrect);
  }, [isAnswered, onAnswer, question.correctAnswerIndex]);

  const timerDuration = useMemo(() => DIFFICULTY_SETTINGS[difficulty].timer, [difficulty]);

  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <div className={`bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl transition-colors duration-500 ${feedbackClass}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-slate-400">Question {questionNumber}/{totalQuestions}</div>
        <div className="text-lg font-bold text-cyan-400">Score: {score}</div>
      </div>
      <ProgressBar value={questionNumber} max={totalQuestions} />
      
      <div className="my-6 flex justify-between items-start animate-fadeIn">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-100 pr-4">{question.question}</h2>
        <Timer duration={timerDuration} onTimeUp={onTimeUp} isPaused={isAnswered} key={questionNumber} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswerIndex;
          let buttonClass = 'bg-slate-700 hover:bg-slate-600';
          let icon = null;

          if (isAnswered) {
            if (isCorrect) {
              buttonClass = 'bg-green-600 ring-2 ring-green-400';
              icon = <CheckIcon className="w-5 h-5" />;
            } else if (selectedAnswer === index) {
              buttonClass = 'bg-red-600 ring-2 ring-red-400';
              icon = <XIcon className="w-5 h-5" />;
            } else {
               buttonClass = 'bg-slate-700 opacity-60';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg transition duration-300 flex items-center justify-between ${buttonClass} disabled:cursor-not-allowed`}
            >
              <span className="flex-grow">{option}</span>
              {icon && <span className="ml-2 flex-shrink-0">{icon}</span>}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-cyan-400">
            <LightbulbIcon className="w-5 h-5"/>
            Explanation
          </h4>
          <p className="text-slate-300">{question.explanation}</p>
          <button 
            onClick={onNextQuestion}
            className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-fuchsia-600 transition-transform transform hover:scale-105"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
