import { createApi } from '@reduxjs/toolkit/query/react';

import { dictionaryApi } from '@/entities/dictionary/api/dictionaryApi';
import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

export type McDirection = 'word_to_translation' | 'translation_to_word';

export interface MultipleChoiceContent {
  wordId: string;
  direction: McDirection;
  prompt: string;
  options: string[];
  correctIndex: number;
  word: string;
  translation: string;
  definition: string;
  ipa: string;
  audioUrl: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
  mcOptionId: string | null;
}

export interface ContextFillContent {
  wordId: string;
  sentence: string;
  answer: string;
  options: string[];
  word: string;
  translation: string;
  definition: string;
  ipa: string;
  audioUrl: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
}

export interface TypeTheWordContent {
  wordId: string;
  prompt: string;
  correctAnswer: string;
  hint: string;
  word: string;
  translation: string;
  definition: string;
  ipa: string;
  audioUrl: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
}

export interface OddOneOutContent {
  wordId: string;
  words: string[];
  oddIndex: number;
  category: string;
  word: string;
  translation: string;
  definition: string;
  ipa: string;
  audioUrl: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
}

export interface WordFormationContent {
  wordId: string;
  baseWord: string;
  basePOS: string;
  targetPOS: string;
  answer: string;
  context: string;
  hints: string[];
  word: string;
  translation: string;
  definition: string;
  ipa: string;
  audioUrl: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
}

export interface VerbFormsDrillContent {
  wordId: string;
  baseForm: string;
  pastSimple: string;
  pastParticiple: string;
  definition: string;
  phonetic: string;
  phoneticAudioLink: string;
}

export interface ErrorCorrectionContent {
  ruleId: string;
  words: string[];
  errorIdx: number;
  correction: string;
  topic: string;
  category: string;
  ruleTitle: string;
  explanation: string;
  rule: string;
  practiceCount: number;
  correctCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string | null;
}

export interface SentenceTransformContent {
  ruleId: string;
  original: string;
  answers: string[];
  model: string;
  keyword: string;
  type: string;
  topic: string;
  category: string;
  explanation: string;
  rule: string;
  practiceCount: number;
  correctCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string | null;
}

export interface ClozeTestBlank {
  id: number;
  answer: string;
  explanation: string;
}

export interface ClozeTestContent {
  ruleId: string;
  title: string;
  topic: string;
  category: string;
  text: string;
  blanks: ClozeTestBlank[];
  rule: string;
  practiceCount: number;
  correctCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string | null;
}

export interface RuleQuizContent {
  ruleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  category: string;
  ruleTitle: string;
  rulePattern: string | null;
  explanation: string;
  ruleReminder: string;
  practiceCount: number;
  correctCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string | null;
}

export interface PhraseBuilderContent {
  ruleId: string;
  correctSentence: string;
  scrambledWords: string[];
  hint: string;
  topic: string;
  category: string;
  ruleTitle: string;
  practiceCount: number;
  correctCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string | null;
}

export interface SentenceOrderingContent {
  passageKey: string;
  prompt: string;
  sentences: string[];
  topic: string;
  level: string;
}

export interface RPQuestionChoice {
  type: 'mc' | 'inf';
  text: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface RPQuestionTF {
  type: 'tf';
  text: string;
  correct: boolean;
  explain: string;
}

export type RPQuestion = RPQuestionChoice | RPQuestionTF;

export interface ReadingPassageContent {
  passageKey: string;
  level: string;
  topic: string;
  wordCount: number;
  title: string;
  html: string;
  questions: RPQuestion[];
}

export interface TranslateSentenceContent {
  wordId: string;
  nativeTranslation: string;
  nativeDefinition: string;
  nativeLanguage: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  exampleSentence: string;
  word: string;
  translation: string;
  definition: string;
  ipa: string;
  audioUrl: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
}

export interface WriteSentenceContent {
  wordId: string;
  targetWord: string;
  definition: string;
  partOfSpeech: string[];
  estimatedLevel: string | null;
  ipa: string;
  audioUrl: string;
  exampleSentence: string;
  minWords: number;
  maxWords: number;
  word: string;
  translation: string;
  currentMastery: number;
  skill: number;
  seenCount: number;
  lastSeenAt: string | null;
  nextDueAt: string | null;
}

export type ExerciseContent =
  | MultipleChoiceContent
  | ContextFillContent
  | TypeTheWordContent
  | OddOneOutContent
  | WordFormationContent
  | VerbFormsDrillContent
  | RuleQuizContent
  | ErrorCorrectionContent
  | SentenceTransformContent
  | ClozeTestContent
  | PhraseBuilderContent
  | SentenceOrderingContent
  | ReadingPassageContent
  | TranslateSentenceContent
  | WriteSentenceContent;

export function isSentenceOrderingContent(
  content: ExerciseContent
): content is SentenceOrderingContent {
  return (
    'passageKey' in content && 'sentences' in content && 'prompt' in content
  );
}

export function isReadingPassageContent(
  content: ExerciseContent
): content is ReadingPassageContent {
  return 'passageKey' in content && 'html' in content && 'questions' in content;
}

export function isContextFillContent(
  content: ExerciseContent
): content is ContextFillContent {
  return 'sentence' in content && 'answer' in content;
}

export function isMultipleChoiceContent(
  content: ExerciseContent
): content is MultipleChoiceContent {
  return 'correctIndex' in content && 'direction' in content;
}

export function isTypeTheWordContent(
  content: ExerciseContent
): content is TypeTheWordContent {
  return (
    'typedWord' in content || ('correctAnswer' in content && 'hint' in content)
  );
}

export function isOddOneOutContent(
  content: ExerciseContent
): content is OddOneOutContent {
  return 'oddIndex' in content && 'words' in content && 'category' in content;
}

export function isWordFormationContent(
  content: ExerciseContent
): content is WordFormationContent {
  return 'baseWord' in content && 'targetPOS' in content && 'hints' in content;
}

export function isVerbFormsDrillContent(
  content: ExerciseContent
): content is VerbFormsDrillContent {
  return (
    'baseForm' in content &&
    'pastSimple' in content &&
    'pastParticiple' in content
  );
}

export function isErrorCorrectionContent(
  content: ExerciseContent
): content is ErrorCorrectionContent {
  return 'errorIdx' in content && 'correction' in content && 'words' in content;
}

export function isSentenceTransformContent(
  content: ExerciseContent
): content is SentenceTransformContent {
  return 'original' in content && 'answers' in content && 'model' in content;
}

export function isClozeTestContent(
  content: ExerciseContent
): content is ClozeTestContent {
  return (
    'blanks' in content &&
    'text' in content &&
    'title' in content &&
    'ruleId' in content
  );
}

export function isPhraseBuilderContent(
  content: ExerciseContent
): content is PhraseBuilderContent {
  return 'correctSentence' in content && 'scrambledWords' in content;
}

export function isRuleQuizContent(
  content: ExerciseContent
): content is RuleQuizContent {
  return (
    'ruleId' in content && 'ruleTitle' in content && 'rulePattern' in content
  );
}

export function isTranslateSentenceContent(
  content: ExerciseContent
): content is TranslateSentenceContent {
  return (
    'nativeTranslation' in content &&
    'correctAnswer' in content &&
    'nativeLanguage' in content
  );
}

export function isWriteSentenceContent(
  content: ExerciseContent
): content is WriteSentenceContent {
  return (
    'targetWord' in content && 'minWords' in content && 'maxWords' in content
  );
}

export interface ExerciseQuestion {
  id: string;
  content: ExerciseContent;
  difficulty: number;
}

interface StartSessionResponse {
  sessionId: string;
  exerciseType: string;
  currentIndex: number;
  question: ExerciseQuestion;
}

export interface SubmitAnswerResult {
  isCorrect: boolean;
  score: number;
  explanation: string;
  details: {
    selectedOption: string;
    correctOption: string;
    wasCorrect: boolean;
    newMastery: number;
    oldMastery: number;
    newSkill: number;
    oldSkill: number;
    nextReviewDate: string;
    masteryChanged: boolean;
  };
}

interface SubmitAnswerResponse {
  result: SubmitAnswerResult;
  session: {
    currentIndex: number;
    correctCount: number;
    wrongCount: number;
    totalPoints: number;
  };
  nextQuestion: ExerciseQuestion | null;
}

interface BatchQuestionsResponse {
  questions: ExerciseQuestion[];
}

interface CompleteSessionResponse {
  sessionId: string;
  correctCount: number;
  wrongCount: number;
  totalAnswered: number;
  totalPoints: number;
  totalTimeMs: number;
}

export const exerciseApi = createApi({
  reducerPath: 'exerciseApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['ExerciseSession'],
  endpoints: builder => ({
    startExerciseSession: builder.mutation<
      StartSessionResponse,
      {
        exerciseType:
          | 'MULTIPLE_CHOICE'
          | 'CONTEXT_FILL'
          | 'TYPE_THE_WORD'
          | 'ODD_ONE_OUT'
          | 'WORD_FORMATION'
          | 'VERB_FORMS_DRILL'
          | 'RULE_QUIZ'
          | 'ERROR_CORRECTION'
          | 'SENTENCE_TRANSFORM'
          | 'CLOZE_TEST'
          | 'PHRASE_BUILDER'
          | 'SENTENCE_ORDERING'
          | 'READING_PASSAGE'
          | 'TRANSLATE_SENTENCE'
          | 'WRITE_SENTENCE';
        strategy?: string;
      }
    >({
      query: body => ({
        url: '/exercises/sessions',
        method: 'POST',
        body,
      }),
    }),

    submitExerciseAnswer: builder.mutation<
      SubmitAnswerResponse,
      {
        sessionId: string;
        questionId: string;
        answer:
          | { selectedIndex: number }
          | { selectedOption: string }
          | { typedWord: string }
          | { v2: string; v3: string }
          | { selectedWordIdx: number; userCorrection: string }
          | { userSentence: string }
          | { blanks: Record<string, string> }
          | { arrangedWords: string[] }
          | { userOrder: number[] }
          | { answers: Record<string, number | boolean> }
          | { userTranslation: string };
        timeSpentMs?: number;
      }
    >({
      query: ({ sessionId, ...body }) => ({
        url: `/exercises/sessions/${sessionId}/answer`,
        method: 'POST',
        body,
      }),
    }),

    batchExerciseQuestions: builder.mutation<
      BatchQuestionsResponse,
      { sessionId: string; count: number }
    >({
      query: ({ sessionId, ...body }) => ({
        url: `/exercises/sessions/${sessionId}/batch`,
        method: 'POST',
        body,
      }),
    }),

    completeExerciseSession: builder.mutation<
      CompleteSessionResponse,
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/exercises/sessions/${sessionId}/complete`,
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['Words', 'DictionaryStats'])
        );
      },
    }),

    abandonExerciseSession: builder.mutation<void, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/exercises/sessions/${sessionId}/abandon`,
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['Words', 'DictionaryStats'])
        );
      },
    }),
  }),
});

export const {
  useStartExerciseSessionMutation,
  useSubmitExerciseAnswerMutation,
  useBatchExerciseQuestionsMutation,
  useCompleteExerciseSessionMutation,
  useAbandonExerciseSessionMutation,
} = exerciseApi;
