export type LearningItemType =
  | 'word'
  | 'phrase'
  | 'irregular_verb'
  | 'grammar_rule'
  | 'grammar_vocabulary'
  | 'error_pattern';

export type LearningStage =
  | 'new'
  | 'explanation'
  | 'practice'
  | 'production'
  | 'review'
  | 'mastered';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface QueueItem {
  metadataId: string;
  itemType: LearningItemType;
  itemId: string;
  title: string;
  level: CEFRLevel | null;
  stage: LearningStage;
  nextReviewAt: string | null;
  totalScore: number;
  reason: string;
  typeSpecificData:
    | WordData
    | PhraseData
    | IrregularVerbData
    | GrammarRuleData
    | ErrorPatternData;
}

export interface WordData {
  definition: string | null;
  phoneticText: string | null;
  phoneticAudioLink: string | null;
}

export interface PhraseData {
  definition: string | null;
  phoneticText: string | null;
  phoneticAudioLink: string | null;
}

export interface IrregularVerbData {
  baseForm: string;
  pastSimple: string;
  pastParticiple: string;
  definition: string | null;
}

export interface GrammarRuleData {
  explanation: string;
  pattern: string | null;
  notes: string | null;
  topicId: string;
}

export interface ErrorPatternData {
  description: string;
  category: string;
  examplesWrong: string[];
  examplesRight: string[];
  explanation: string;
}

export interface UserLearningPreferences {
  id: string;
  userId: string;
  currentLevel: CEFRLevel | null;
  targetLevel: CEFRLevel | null;
  dailyNewItemsTarget: number;
  dailyReviewTarget: number;
  typeQuotas: Record<string, number>;
  enableAdaptiveQuotas: boolean;
  focusAreas: string[];
}

export interface ErrorStatistics {
  totalErrors: number;
  recentErrors: number;
  topCategories: { category: string; count: number }[];
  improvementRate: number;
}

export type DailySectionKey = 'newWords' | 'grammar' | 'review' | 'errors';

export interface DailyPlanPreviewItem {
  metadataId: string;
  itemType: LearningItemType;
  title: string;
  level: CEFRLevel | null;
  stage: LearningStage;
  typeSpecificData: Record<string, unknown>;
  errorCountLast7d: number;
  translation: string | null;
}

export interface DailyPlanSection {
  total: number;
  completedToday: number;
  previewItems: DailyPlanPreviewItem[];
}

export interface DailyPlanData {
  sections: {
    newWords: DailyPlanSection;
    grammar: DailyPlanSection;
    review: DailyPlanSection;
    errors: DailyPlanSection;
  };
  dailyTarget: number;
  todayScore: number;
}
