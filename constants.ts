
import { Difficulty } from './types';

export const DIFFICULTY_SETTINGS = {
  [Difficulty.EASY]: { points: 10, timer: 30 },
  [Difficulty.MEDIUM]: { points: 20, timer: 20 },
  [Difficulty.HARD]: { points: 30, timer: 15 },
};

export const LOCAL_STORAGE_KEYS = {
  USER_PROFILE: 'quizAppUserProfile',
  LEADERBOARD: 'quizAppLeaderboard',
  QUIZ_HISTORY: 'quizAppHistory',
};
