import type { Database } from '@/types/supabase';

export type WordStatus = Database['public']['Enums']['word_status'];

export interface DictionaryWordRow {
  word_id: string;
  text: string;
  definition: string;
  translation: string;
  translation_definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  status: WordStatus;
  usagecount: number;
  total_count: number;
  in_reviews: boolean;
  antonyms: string;
  synonymous: string;
}

export interface GetDictStatsResponse {
  [key: string]: number;
}

export interface UserDictionaryStatsResponse {
  totalWords: number;
  wordStats: GetDictStatsResponse;
}

export interface FetchWordsPageParams {
  page: number;
  pageSize: number;
  statusFilter?: WordStatus[];
  search?: string;
  langCode?: string;
  translationLang?: string;
  reviewIds?: string[];
}

export interface Word {
  id: string;
  word: string;
  definition: string;
  translation: string;
  example?: string;
  status: WordStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  phonetic?: {
    text: string;
    audio: string;
  };
  analysisIds?: string[];
  usageCount: number;
}

export interface FetchWordsPageResponse {
  words: Word[];
  totalWords: number;
  page: number;
  hasMore: boolean;
}

