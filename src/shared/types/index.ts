// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Word types
export interface Word {
  id: string;
  text: string;
  translation: string;
  difficulty: WordDifficulty;
  status: WordStatus;
  context?: string;
  examples?: string[];
  createdAt: string;
  updatedAt: string;
  lastReviewed?: string;
  reviewCount: number;
  correctAnswers: number;
  totalAnswers: number;
}

export type WordDifficulty = 'beginner' | 'basic' | 'intermediate' | 'advanced';
export type WordStatus =
  | 'notLearned'
  | 'beginner'
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'wellKnown'
  | 'mastered';

// Dictionary types
export interface Dictionary {
  id: string;
  name: string;
  description?: string;
  words: Word[];
  createdAt: string;
  updatedAt: string;
}

// Training types
export interface TrainingSession {
  id: string;
  userId: string;
  words: Word[];
  currentWordIndex: number;
  score: number;
  totalWords: number;
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'paused';
}

export interface TrainingQuestion {
  id: string;
  word: Word;
  type: 'translation' | 'context' | 'multipleChoice';
  options?: string[];
  correctAnswer: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  wordId: string;
  word: Word;
  result: 'correct' | 'incorrect';
  reviewDate: string;
  nextReviewDate: string;
  interval: number;
}

// Analysis types
export interface WordAnalysis {
  id: string;
  text: string;
  words: Word[];
  difficulty: WordDifficulty;
  estimatedTime: number;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation types
export type RootStackParamList = {
  '(tabs)': undefined;
  auth: undefined;
  training: undefined;
  dictionary: undefined;
  reviews: undefined;
  profile: undefined;
  analysis: undefined;
};

export type TabParamList = {
  index: undefined;
  explore: undefined;
  training: undefined;
  dictionary: undefined;
  profile: undefined;
};

// Theme types
export type ColorScheme = 'light' | 'dark';
export type Theme = 'system' | 'light' | 'dark';

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: AppError;
}

// Async state
export interface AsyncState<T> extends LoadingState {
  data?: T;
}
