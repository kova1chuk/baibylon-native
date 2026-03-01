import type { IrregularVerb } from '@/entities/irregular-verb/types';
import type { DictionaryIrregularVerbRowDto } from '@/shared/types/openapi';

export type DictionaryIrregularVerbRow = DictionaryIrregularVerbRowDto;

export interface FetchIrregularVerbsPageResponse {
  irregularVerbs: IrregularVerb[];
  totalIrregularVerbs: number;
  page: number;
  hasMore: boolean;
}

export interface FetchIrregularVerbsPageParams {
  page: number;
  pageSize: number;
  statusFilter?: number[];
  search?: string;
  langCode?: string;
  translationLang?: string;
}
