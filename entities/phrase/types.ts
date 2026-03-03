import { WordStatus } from "@/shared/types";

export interface Phonetic {
  text: string;
  audio: string;
}

export interface Phrase {
  id: string;
  text: string;
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
