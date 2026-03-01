import { WordStatus } from '@/shared/types';

export interface MasteryChange {
  wordId: string;
  previousMastery: number;
  newMastery: number;
  newStatus: number;
}

export interface Phonetic {
  text: string;
  audio: string;
}

export interface WordDetails {
  phonetics: Phonetic[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }[];
  }[];
}

export interface Word {
  id: string;
  word: string;
  definition?: string;
  translation?: string;
  example?: string;
  status: WordStatus;
  phonetic: Phonetic;
  userId: string;
  createdAt: string;
  updatedAt: string;
  details?: WordDetails;
  isLearned?: boolean;
  isInDictionary?: boolean;
  usages?: string[];
  analysisIds?: string[];
  lastTrainedAt?: string;
  usageCount?: number;
  seenTimes?: number;
  queueScore?: number;
  masteryScore?: number;
}

export interface WordState {
  words: Word[];
  loading: boolean;
  error: string | null;
  selectedWord: Word | null;
}

export interface UpdateWordRequest {
  id: string;
  definition?: string;
  translation?: string;
  status?: string;
  details?: WordDetails;
}

export const WORD_STATUS_LABELS = {
  1: 'Not Started',
  2: 'Discovered',
  3: 'Learning',
  4: 'Practicing',
  5: 'Familiar',
  6: 'Confident',
  7: 'Mastered',
} as const;

export const WORD_STATUS_COLORS = {
  1: 'bg-status-not-started status-not-started border-status-not-started',
  2: 'bg-status-discovered status-discovered border-status-discovered',
  3: 'bg-status-learning status-learning border-status-learning',
  4: 'bg-status-practicing status-practicing border-status-practicing',
  5: 'bg-status-familiar status-familiar border-status-familiar',
  6: 'bg-status-confident status-confident border-status-confident',
  7: 'bg-status-mastered status-mastered border-status-mastered',
} as const;
