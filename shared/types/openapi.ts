export type DictionaryWordRowDto = {
  word_id: string;
  text: string;
  definition: string;
  translation: string;
  translation_definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  status: string;
  in_reviews: boolean;
  usagecount: number;
  total_count: number;
  queue_score?: number;
  mastery_score?: number;
};

export type DictionaryPhraseRowDto = {
  phrase_id: string;
  text: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  status: string;
  translation: string;
  translation_definition: string;
  usagecount: number;
  total_count: number;
};

export type DictionaryIrregularVerbRowDto = {
  irregular_verb_id: string;
  base_form: string;
  past_simple: string;
  past_participle: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  status: string;
  translation: string;
  translation_definition: string;
  usagecount: number;
  total_count: number;
};

export type TrainingQueueRowDto = {
  word_id: string;
  text: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  status: string;
  translation: string;
  translation_definition: string;
  mastery_score: number;
  skill: number;
  priority: number;
  seen_count: number;
  last_seen_at?: string;
  next_due_at?: string;
};

export type WordNlpDataDto = {
  word_id: string;
  zipf_frequency?: number;
  is_top_1k?: boolean;
  is_top_5k?: boolean;
  is_top_10k?: boolean;
  is_top_50k?: boolean;
  pos_available?: string[];
  synonyms?: string[];
  hypernyms?: string[];
  derived_forms?: string[];
  verb_frames?: string[];
  examples?: string[];
  estimated_level?: string;
  suggested_priority?: number;
  primary_definition?: string;
};
