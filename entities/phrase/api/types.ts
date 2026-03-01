import type { Phrase } from '@/entities/phrase/types';
import type { DictionaryPhraseRowDto } from '@/shared/types/openapi';

export type DictionaryPhraseRow = DictionaryPhraseRowDto;

export interface FetchPhrasesPageResponse {
  phrases: Phrase[];
  totalPhrases: number;
  page: number;
  hasMore: boolean;
}

export interface FetchPhrasesPageParams {
  page: number;
  pageSize: number;
  statusFilter?: number[];
  search?: string;
  langCode?: string;
  translationLang?: string;
}
