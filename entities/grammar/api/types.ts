export interface GrammarLevelRow {
  id: string;
  code: string;
  name: string;
  description: string;
  order_index: number;
  total_topics: number;
  completed_topics: number;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface GrammarCategoryRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  total_topics: number;
  completed_topics: number;
  in_progress_topics: number;
}

export interface GrammarTopicRow {
  id: string;
  name: string;
  description: string;
  order_index: number;
  total_rules: number;
  completed_rules: number;
  total_vocabulary: number;
  learned_vocabulary: number;
  status: string;
  mastery_score: number;
  last_reviewed_at: string;
  next_review_at: string;
}

export interface TopicContentData {
  topic: {
    id: string;
    name: string;
    description: string;
    level_code?: string;
    category_name?: string;
    progress: {
      status: string;
      mastery_score: number;
      last_reviewed_at: string | null;
      next_review_at: string | null;
    } | null;
  };
  rules: {
    id: string;
    title: string;
    explanation: string;
    pattern: string;
    pattern_lines: unknown | null;
    notes: string;
    order_index: number;
    progress: {
      understood: boolean;
      practice_count: number;
      correct_count: number;
      last_practiced_at: string | null;
    } | null;
    examples: {
      id: string;
      sentence: string;
      translation: string | null;
      explanation: string | null;
      is_correct: boolean;
    }[];
  }[];
  vocabulary: {
    id: string;
    word: string;
    word_id: string | null;
    translation: string | null;
    part_of_speech: string;
    example_sentence: string | null;
    pronunciation: string | null;
    audio_url: string | null;
    progress: {
      status: string;
      practice_count: number;
      correct_count: number;
      last_practiced_at: string | null;
    } | null;
  }[];
}
