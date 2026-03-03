import { createApi } from "@reduxjs/toolkit/query/react";

import { dictionaryApi } from "@/entities/dictionary/api/dictionaryApi";
import { dashboardApi } from "@/features/hub/api/dashboardApi";
import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

import type {
  FetchPhrasesPageResponse,
  FetchPhrasesPageParams,
  DictionaryPhraseRow,
} from "./types";

import type { WordStatus } from "@/shared/types";

export const phraseApi = createApi({
  reducerPath: "phraseApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["Phrases"],
  endpoints: (builder) => ({
    fetchPhrasesPage: builder.query<FetchPhrasesPageResponse, FetchPhrasesPageParams>({
      query: ({
        page,
        pageSize,
        statusFilter = [],
        search = "",
        langCode = "en",
        translationLang = "uk",
      }) => ({
        url: "/dictionary/phrases",
        params: {
          langCode,
          translationLang,
          limitCount: pageSize,
          offsetCount: (page - 1) * pageSize,
          searchText: search || undefined,
          statusFilter: statusFilter.length > 0 ? statusFilter.join(",") : undefined,
        },
      }),
      providesTags: (result, error, arg) => {
        return [{ type: "Phrases", id: arg.page }];
      },
      transformResponse: (response: DictionaryPhraseRow[], _meta, arg: FetchPhrasesPageParams) => {
        const rows = response || [];
        const totalPhrases = rows.length > 0 ? Number(rows[0].total_count) : 0;

        const phrases = rows.map((row) => ({
          id: row.phrase_id,
          text: row.text,
          definition: row.definition,
          translation: row.translation,
          status: parseInt(row.status) as WordStatus,
          userId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phonetic: {
            text: row.phonetic_text,
            audio: row.phonetic_audio_link,
          },
          usageCount: row.usagecount,
        }));

        return {
          phrases,
          totalPhrases,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < totalPhrases,
        };
      },
    }),
    updatePhraseStatus: builder.mutation<
      void,
      { langCode: string; phraseId: string; newStatus: string }
    >({
      query: ({ langCode, phraseId, newStatus }) => ({
        url: `/dictionary/phrases/${phraseId}/status`,
        method: "PATCH",
        body: { langCode, newStatus },
      }),
      invalidatesTags: ["Phrases"],
    }),
    removePhraseFromDictionary: builder.mutation<void, { langCode: string; phraseId: string }>({
      query: ({ langCode, phraseId }) => ({
        url: `/dictionary/phrases/${phraseId}`,
        method: "DELETE",
        params: { langCode },
      }),
      invalidatesTags: ["Phrases"],
    }),
    addPhrase: builder.mutation<
      string | null,
      { langCode: string; phraseText?: string; phraseId?: string }
    >({
      query: ({ langCode, phraseText, phraseId }) => ({
        url: "/dictionary/phrases",
        method: "POST",
        body: { langCode, phraseText: phraseText ?? "", phraseId },
      }),
      invalidatesTags: ["Phrases"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dictionaryApi.util.invalidateTags(["DictionaryStats", "Words"]));
        dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
      },
    }),
    updatePhraseDefinition: builder.mutation<
      { success: boolean },
      {
        langCode: string;
        phraseId: string;
        definition?: string;
        phoneticText?: string;
        phoneticAudioLink?: string;
      }
    >({
      query: ({ langCode, phraseId, definition, phoneticText, phoneticAudioLink }) => ({
        url: `/dictionary/phrases/${phraseId}/definition`,
        method: "PATCH",
        body: {
          langCode,
          definition: definition || undefined,
          phoneticText: phoneticText || undefined,
          phoneticAudioLink: phoneticAudioLink || undefined,
        },
      }),
      invalidatesTags: ["Phrases"],
    }),
    updatePhraseTranslation: builder.mutation<
      { success: boolean },
      {
        langCode: string;
        targetLangCode: string;
        phraseId: string;
        definition: string;
        translationsText: string;
      }
    >({
      query: ({ langCode, targetLangCode, phraseId, definition, translationsText }) => ({
        url: `/dictionary/phrases/${phraseId}/translation`,
        method: "PATCH",
        body: {
          langCode,
          targetLangCode,
          definition,
          translationsText,
        },
      }),
      invalidatesTags: ["Phrases"],
    }),
    reloadPhraseDefinition: builder.mutation<
      { definition: string; phoneticText: string; phoneticAudioLink: string },
      { langCode: string; phraseId: string }
    >({
      query: ({ langCode, phraseId }) => ({
        url: `/dictionary/phrases/${phraseId}/reload-definition`,
        method: "POST",
        body: { langCode },
      }),
      invalidatesTags: ["Phrases"],
    }),
    reloadPhraseTranslation: builder.mutation<
      { translatedText: string },
      { langCode: string; phraseId: string; targetLangCode?: string }
    >({
      query: ({ langCode, phraseId, targetLangCode = "uk" }) => ({
        url: `/dictionary/phrases/${phraseId}/reload-translation`,
        method: "POST",
        body: { langCode, targetLangCode },
      }),
      invalidatesTags: ["Phrases"],
    }),
  }),
});

export const {
  useFetchPhrasesPageQuery,
  useUpdatePhraseStatusMutation,
  useRemovePhraseFromDictionaryMutation,
  useAddPhraseMutation,
  useUpdatePhraseDefinitionMutation,
  useUpdatePhraseTranslationMutation,
  useReloadPhraseDefinitionMutation,
  useReloadPhraseTranslationMutation,
} = phraseApi;
