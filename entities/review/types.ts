export interface SerializableTimestamp {
  seconds: number;
  nanoseconds: number;
  dateString: string;
}

export interface Review {
  id: string;
  title: string;
  userId: string;
  createdAt: SerializableTimestamp;
  summary: {
    totalWords: number;
    uniqueWords: number;
    knownWords: number;
    unknownWords: number;
    wordStats?: { [key: number]: number };
  };
  sentencesCount?: number;
}

export interface Sentence {
  id: string;
  text: string;
  index: number;
}

export interface WordInfo {
  word: string;
  definition?: string;
  translation?: string;
  details?: Record<string, unknown>;
}

export interface TrainingStats {
  learned: number;
  notLearned: number;
  total: number;
}

export interface FirestoreDocSnapshot {
  id: string;
  exists: () => boolean;
  data: () => Record<string, unknown>;
}

export interface ReviewState {
  review: Review | null;
  sentences: Sentence[];
  loading: boolean;
  error: string | null;
  selectedWord: WordInfo | null;
  wordInfoLoading: boolean;
  reloadingDefinition: boolean;
  reloadingTranslation: boolean;

  sentencesLoading: boolean;
  hasMore: boolean;
  lastDoc: FirestoreDocSnapshot | null;

  trainingStats: TrainingStats | null;
  trainingLoading: boolean;
}

export interface ReviewViewState {
  viewMode: 'list' | 'columns';
  isFullScreen: boolean;
  currentPage: number;
  sentencesPerPage: number;
  showSettings: boolean;
}
