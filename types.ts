
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
}

export interface QuizHistoryEntry {
  topic: string;
  score: number;
  difficulty: Difficulty;
  date: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  topic: string;
  difficulty: Difficulty;
  date: string;
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum GameScreen {
  START,
  QUIZ,
  RESULTS
}
