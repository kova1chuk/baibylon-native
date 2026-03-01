export interface HubWordRow {
  word_id: string;
  text: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  translation: string;
  translation_definition: string;
  in_user_dictionary: boolean;
  user_status: string;
  total_count: number;
}

export interface HubPhraseRow {
  phrase_id: string;
  text: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  translation: string;
  translation_definition: string;
  in_user_dictionary: boolean;
  user_status: string;
  total_count: number;
}

export interface HubIrregularVerbRow {
  irregular_verb_id: string;
  base_form: string;
  past_simple: string;
  past_participle: string;
  definition: string;
  phonetic_text: string;
  phonetic_audio_link: string;
  translation: string;
  translation_definition: string;
  in_user_dictionary: boolean;
  user_status: string;
  total_count: number;
}

export interface HubIrregularAdjectiveRow {
  id: string;
  base_form: string;
  comparative: string;
  superlative: string;
  definition: string | null;
  phonetic_text: string | null;
  phonetic_audio_link: string | null;
  translation: string;
  in_user_dictionary: boolean;
  total: number;
}

export interface HubWord {
  id: string;
  text: string;
  definition: string;
  phoneticText: string;
  phoneticAudioLink: string;
  translation: string;
  translationDefinition: string;
  inUserDictionary: boolean;
  userStatus: string;
}

export interface HubPhrase {
  id: string;
  text: string;
  definition: string;
  phoneticText: string;
  phoneticAudioLink: string;
  translation: string;
  translationDefinition: string;
  inUserDictionary: boolean;
  userStatus: string;
}

export interface HubIrregularVerb {
  id: string;
  baseForm: string;
  pastSimple: string;
  pastParticiple: string;
  definition: string;
  phoneticText: string;
  phoneticAudioLink: string;
  translation: string;
  translationDefinition: string;
  inUserDictionary: boolean;
  userStatus: string;
}

export interface HubIrregularAdjective {
  id: string;
  baseForm: string;
  comparative: string;
  superlative: string;
  definition: string;
  phoneticText: string;
  phoneticAudioLink: string;
  translation: string;
  inUserDictionary: boolean;
}

export interface FetchHubItemsParams {
  page: number;
  pageSize: number;
  search?: string;
  langCode?: string;
  translationLang?: string;
}

export interface FetchHubWordsResponse {
  words: HubWord[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface FetchHubPhrasesResponse {
  phrases: HubPhrase[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface FetchHubIrregularVerbsResponse {
  irregularVerbs: HubIrregularVerb[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface FetchHubIrregularAdjectivesResponse {
  irregularAdjectives: HubIrregularAdjective[];
  total: number;
  page: number;
  hasMore: boolean;
}
