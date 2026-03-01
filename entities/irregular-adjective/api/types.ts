import type { IrregularAdjective } from '@/entities/irregular-adjective/types';

export interface DictionaryIrregularAdjectiveRow {
  irregular_adjective_id: string;
  base_form: string;
  comparative: string;
  superlative: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  status: string;
  translation: string;
  translation_definition: string;
  usagecount: number;
  total_count: number;
}

export interface FetchIrregularAdjectivesPageResponse {
  irregularAdjectives: IrregularAdjective[];
  totalIrregularAdjectives: number;
  page: number;
  hasMore: boolean;
}

export interface FetchIrregularAdjectivesPageParams {
  page: number;
  pageSize: number;
  statusFilter?: number[];
  search?: string;
  langCode?: string;
  translationLang?: string;
}
