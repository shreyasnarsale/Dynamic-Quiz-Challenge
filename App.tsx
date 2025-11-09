import React, { useState, useCallback } from 'react';
import { GameScreen, Difficulty, QuizQuestion, LeaderboardEntry, UserProfile, QuizHistoryEntry } from './types';
import { generateQuiz } from './services/geminiService';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { DIFFICULTY_SETTINGS, LOCAL_STORAGE_KEYS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { BrainCircuitIcon } from './components/icons';

const App: React.FC = () => {
  const [gameScreen, setGameScreen] = useState<GameScreen>(GameScreen.START);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>(LOCAL_STORAGE_KEYS.LEADERBOARD, []);
  const [quizHistory, setQuizHistory] = useLocalStorage<QuizHistoryEntry[]>(LOCAL_STORAGE_KEYS.QUIZ_HISTORY, []);

  const handleStartQuiz = useCallback(async (selectedTopic: string, selectedDifficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    setTopic(selectedTopic);
    setDifficulty(selectedDifficulty);

    try {
      const questions = await generateQuiz(selectedTopic, selectedDifficulty);
      if (questions && questions.length > 0) {
        setQuiz(questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameScreen(GameScreen.QUIZ);
      } else {
        throw new Error("The generated quiz was empty. Please try a different topic.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.');
      setGameScreen(GameScreen.START);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleFinishQuiz = useCallback(() => {
    const newHistoryEntry: QuizHistoryEntry = {
      topic,
      score,
      difficulty,
      date: new Date().toISOString(),
    };
    setQuizHistory(prev => [newHistoryEntry, ...prev].slice(0, 50)); // Add to start, limit to 50 entries
    setGameScreen(GameScreen.RESULTS);
  }, [topic, score, difficulty, setQuizHistory]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  }, [currentQuestionIndex, quiz.length, handleFinishQuiz]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + DIFFICULTY_SETTINGS[difficulty].points);
    }
  }, [difficulty]);
  
  const handleTimeUp = useCallback(() => {
    handleNextQuestion();
  }, [handleNextQuestion]);

  const handlePlayAgain = useCallback(() => {
    setGameScreen(GameScreen.START);
    setQuiz([]);
  }, []);

  const handleSaveToLeaderboard = useCallback((name: string) => {
    const newEntry: LeaderboardEntry = { name, score, topic, difficulty, date: new Date().toISOString() };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setLeaderboard(updatedLeaderboard);
    setUserProfile({ name });
  }, [leaderboard, score, topic, difficulty, setLeaderboard, setUserProfile]);

  const renderScreen = () => {
    switch (gameScreen) {
      case GameScreen.QUIZ:
        return (
          <QuizScreen
            question={quiz[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            onNextQuestion={handleNextQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.length}
            score={score}
            difficulty={difficulty}
          />
        );
      case GameScreen.RESULTS:
        return (
          <ResultsScreen
            score={score}
            onPlayAgain={handlePlayAgain}
            onSaveToLeaderboard={handleSaveToLeaderboard}
            userProfile={userProfile}
            leaderboard={leaderboard}
            topic={topic}
            difficulty={difficulty}
          />
        );
      case GameScreen.START:
      default:
        return (
          <StartScreen 
            onStartQuiz={handleStartQuiz} 
            isLoading={isLoading}
            error={error}
            userProfile={userProfile}
            quizHistory={quizHistory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
       <div className="w-full max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <BrainCircuitIcon className="w-12 h-12 text-cyan-400"/>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
              Dynamic Quiz Challenge
            </h1>
          </div>
        </header>
        <main className="w-full">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;