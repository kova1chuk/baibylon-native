export type WordStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TrainingType =
  | "input_word"
  | "choose_translation"
  | "context_usage"
  | "synonym_match"
  | "audio_dictation"
  | "manual";

export interface TrainingQuestion {
  id: string;
  wordId: string;
  type: TrainingType;
  question: string;
  correctAnswer: string;
  options?: string[];
  context?: string;
  audioUrl?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
