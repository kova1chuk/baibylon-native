import type { Word } from '@/entities/word/types';
import type {
  DictionaryWordRowDto,
  TrainingQueueRowDto,
} from '@/shared/types/openapi';

export type DictionaryWordRow = DictionaryWordRowDto;
export type QueueDictionaryWordRow = DictionaryWordRowDto;
export type TrainingQueueRow = TrainingQueueRowDto;

export interface GetDictStatsResponse {
  wordStats: Record<string, number>;
  accuracy: number;
}

export interface UserDictionaryStatsResponse {
  totalWords: number;
  wordStats: Record<string, number>;
  accuracy: number;
}

export interface FetchWordsPageResponse {
  words: Word[];
  totalWords: number;
  page: number;
  hasMore: boolean;
}

export type DictionarySortMode = 'recent' | 'queue';

export interface FetchWordsPageParams {
  page: number;
  pageSize: number;
  statusFilter?: number[];
  search?: string;
  langCode?: string;
  translationLang?: string;
  reviewIds?: string[];
  sortMode?: DictionarySortMode;
  exerciseType?: string;
}

export interface TrainingQueueParams {
  trainingType: string;
  limit?: number;
  statusFilter?: number[];
  reviewIds?: string[];
}

export type UnifiedItemType =
  | 'word'
  | 'phrase'
  | 'irregular_verb'
  | 'grammar_rule'
  | 'grammar_vocabulary'
  | 'error_pattern';

export interface UnifiedQueueItem {
  metadataId: string;
  itemType: UnifiedItemType;
  itemId: string;
  title: string;
  level: string | null;
  stage: string;
  nextReviewAt: string | null;
  totalScore: number;
  reason: string;
  typeSpecificData: Record<string, unknown>;
}
