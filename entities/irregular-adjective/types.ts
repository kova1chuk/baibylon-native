import { WordStatus } from "@/shared/types";

export interface Phonetic {
  text: string;
  audio: string;
}

export interface IrregularAdjective {
  id: string;
  baseForm: string;
  comparative: string;
  superlative: string;
  definition?: string;
  translation?: string;
  status: WordStatus;
  phonetic: Phonetic;
  userId: string;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  lastTrainedAt?: string;
}
