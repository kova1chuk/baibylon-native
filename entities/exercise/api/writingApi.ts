import { createApi } from "@reduxjs/toolkit/query/react";

import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

export interface SentencePromptResponse {
  id: string;
  word: string;
  wordLevel: string;
  pos: string;
  definition: string;
  ipa: string | null;
  constraints: {
    grammar?: string;
    minWords?: number;
    maxWords?: number;
    mustInclude?: string[];
  };
}

export interface WritingSubmission {
  id: string;
  exerciseType: string;
  promptData: Record<string, unknown>;
  subject: string | null;
  body: string;
  score: number | null;
  points: number;
  evaluatedAt: string | null;
  createdAt: string;
}

export interface WritingScenarioResponse {
  id: string;
  title: string;
  register: "formal" | "semi-formal" | "informal";
  level: string;
  description: string;
  recipientEmail: string | null;
  targetWordCountMin: number | null;
  targetWordCountMax: number | null;
  requirements: string[];
  modelEmail: string | null;
}

export interface SentenceEvaluationPayload {
  targetWord: string;
  userSentence: string;
  constraints: {
    grammar?: string;
    minWords?: number;
    maxWords?: number;
    mustInclude?: string[];
  };
  wordLevel: string;
}

export interface CriterionResult {
  status: "ok" | "warn" | "no";
  value: string;
}

export interface SentenceEvaluationResponse {
  score: number;
  points: number;
  criteria: {
    grammar: CriterionResult;
    wordUsage: CriterionResult;
    creativity: CriterionResult;
    constraint: CriterionResult;
  };
  annotatedSentence: string;
  improvedSentence: string;
  notes: {
    type: "ok" | "fix" | "warn" | "tip";
    text: string;
  }[];
}

export interface EmailEvaluationPayload {
  scenarioTitle: string;
  scenarioDescription: string;
  register: "formal" | "semi-formal" | "informal";
  level: string;
  requirements: string[];
  subject: string;
  body: string;
  targetWordCount: { min: number; max: number };
}

export interface EmailCriterionScore {
  score: number;
  color: string;
}

export interface EmailEvaluationResponse {
  score: number;
  points: number;
  criteria: {
    structure: EmailCriterionScore;
    toneRegister: EmailCriterionScore;
    taskCompletion: EmailCriterionScore;
    grammar: EmailCriterionScore;
    vocabulary: EmailCriterionScore;
  };
  requirementsMet: boolean[];
  feedbackSections: {
    type: "ok" | "warn" | "fix" | "tip";
    title: string;
    body: string;
  }[];
  modelEmail: string;
}

export interface SummaryEvaluationPayload {
  passageId: string;
  passageText: string;
  userSummary: string;
  targetLanguageLevel: string;
}

export interface SummaryFeedbackItem {
  type: "ok" | "warn" | "fix" | "tip";
  category: string;
  message: string;
  originalText?: string;
  suggestedText?: string;
}

export interface SummaryEvaluationResponse {
  score: number;
  criteria: {
    content: number;
    coherence: number;
    grammar: number;
    vocabulary: number;
    conciseness: number;
  };
  feedback: SummaryFeedbackItem[];
  modelSummary: string;
}

export interface WritingSubmitPayload {
  exerciseType: "SENTENCE" | "EMAIL";
  sessionId?: string;
  promptData: Record<string, unknown>;
  subject?: string;
  body: string;
}

export const writingApi = createApi({
  reducerPath: "writingApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["WritingSubmissions"],
  endpoints: (builder) => ({
    getSentencePrompts: builder.query<SentencePromptResponse[], string | void>({
      query: (level) => ({
        url: "/exercises/writing/sentence-prompts",
        params: level ? { level } : undefined,
      }),
      transformResponse: (response: { success: boolean; data: SentencePromptResponse[] }) =>
        response.data,
    }),

    getScenarios: builder.query<WritingScenarioResponse[], string | void>({
      query: (level) => ({
        url: "/exercises/writing/scenarios",
        params: level ? { level } : undefined,
      }),
      transformResponse: (response: { success: boolean; data: WritingScenarioResponse[] }) =>
        response.data,
    }),

    evaluateSentence: builder.mutation<SentenceEvaluationResponse, SentenceEvaluationPayload>({
      query: (body) => ({
        url: "/exercises/writing/evaluate-sentence",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: SentenceEvaluationResponse }) =>
        response.data,
    }),

    evaluateSummary: builder.mutation<SummaryEvaluationResponse, SummaryEvaluationPayload>({
      query: (body) => ({
        url: "/exercises/writing/evaluate-summary",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: SummaryEvaluationResponse }) =>
        response.data,
    }),

    evaluateEmail: builder.mutation<EmailEvaluationResponse, EmailEvaluationPayload>({
      query: (body) => ({
        url: "/exercises/writing/evaluate-email",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: EmailEvaluationResponse }) =>
        response.data,
    }),

    submitWriting: builder.mutation<WritingSubmission, WritingSubmitPayload>({
      query: (body) => ({
        url: "/exercises/writing/submit",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: WritingSubmission }) => response.data,
      invalidatesTags: ["WritingSubmissions"],
    }),
  }),
});

export const {
  useGetSentencePromptsQuery,
  useGetScenariosQuery,
  useEvaluateSentenceMutation,
  useEvaluateSummaryMutation,
  useEvaluateEmailMutation,
  useSubmitWritingMutation,
} = writingApi;
