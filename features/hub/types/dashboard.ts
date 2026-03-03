export interface DashboardSummary {
  total_words: number;
  words_learned: number;
  current_streak: number;
  grammar_level: string;
  topics_completed: number;
}

export interface ActivityHeatmapData {
  activity_date: string;
  session_count: number;
}

export interface ActivityHeatmap {
  data: ActivityHeatmapData[];
  weeks: number;
}

export interface DashboardHomeResponse {
  wellKnownWords: number;
  totalWords: number;
  cefrLevel: string;
  skillVocabulary: number;
  skillGrammar: number;
  skillReading: number;
  skillWriting: number;
  skillListening: number;
  skillSpeaking: number;
  todayPoints: number;
  todayExercises: number;
  todayActiveTimeMs: number;
  todayWordsReviewed: number;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  subtitle?: string;
  gradientClass: string;
}
