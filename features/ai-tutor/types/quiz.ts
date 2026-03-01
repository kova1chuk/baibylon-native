export type QuizDirection = 'native_to_learning' | 'learning_to_native';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  word: string;
  correctTranslation: string;
  options: string[];
  direction: QuizDirection;
  difficulty: QuizDifficulty;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
  createdAt: Date;
}

export interface QuizResult {
  quizId: string;
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string;
}

export interface QuizAnswerPayload {
  quizId: string;
  selectedOption: string;
  timeSpentMs: number;
  langCode?: string;
}

export interface QuizQuestionEvent {
  quiz: QuizQuestion;
  message: string;
}

export interface QuizResultEvent {
  result: QuizResult;
  message: string;
}

export interface QuizErrorEvent {
  message: string;
  error?: string;
}
