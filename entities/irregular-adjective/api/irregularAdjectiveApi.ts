import { createApi } from "@reduxjs/toolkit/query/react";

import { dictionaryApi } from "@/entities/dictionary/api/dictionaryApi";
import { dashboardApi } from "@/features/hub/api/dashboardApi";
import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

import type {
  DictionaryIrregularAdjectiveRow,
  FetchIrregularAdjectivesPageParams,
  FetchIrregularAdjectivesPageResponse,
} from "./types";

import type { WordStatus } from "@/shared/types";

export const irregularAdjectiveApi = createApi({
  reducerPath: "irregularAdjectiveApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["IrregularAdjectives"],
  endpoints: (builder) => ({
    fetchIrregularAdjectivesPage: builder.query<
      FetchIrregularAdjectivesPageResponse,
      FetchIrregularAdjectivesPageParams
    >({
      query: ({
        page,
        pageSize,
        statusFilter = [],
        search = "",
        langCode = "en",
        translationLang = "uk",
      }) => ({
        url: "/dictionary/irregular-adjectives",
        params: {
          langCode,
          translationLang,
          limitCount: pageSize,
          offsetCount: (page - 1) * pageSize,
          searchText: search || undefined,
          statusFilter: statusFilter.length > 0 ? statusFilter.join(",") : undefined,
        },
      }),
      providesTags: (_result, _error, arg) => {
        return [{ type: "IrregularAdjectives", id: arg.page }];
      },
      transformResponse: (
        response: DictionaryIrregularAdjectiveRow[],
        _meta,
        arg: FetchIrregularAdjectivesPageParams,
      ) => {
        const rows = response || [];
        const totalIrregularAdjectives = rows.length > 0 ? Number(rows[0].total_count) : 0;

        const irregularAdjectives = rows.map((row) => ({
          id: row.irregular_adjective_id,
          baseForm: row.base_form,
          comparative: row.comparative,
          superlative: row.superlative,
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
          irregularAdjectives,
          totalIrregularAdjectives,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < totalIrregularAdjectives,
        };
      },
    }),
    updateIrregularAdjectiveStatus: builder.mutation<
      void,
      {
        langCode: string;
        irregularAdjectiveId: string;
        newStatus: string;
      }
    >({
      query: ({ langCode, irregularAdjectiveId, newStatus }) => ({
        url: `/dictionary/irregular-adjectives/${irregularAdjectiveId}/status`,
        method: "PATCH",
        body: { langCode, newStatus },
      }),
      invalidatesTags: ["IrregularAdjectives"],
    }),
    removeIrregularAdjectiveFromDictionary: builder.mutation<
      void,
      { langCode: string; irregularAdjectiveId: string }
    >({
      query: ({ langCode, irregularAdjectiveId }) => ({
        url: `/dictionary/irregular-adjectives/${irregularAdjectiveId}`,
        method: "DELETE",
        params: { langCode },
      }),
      invalidatesTags: ["IrregularAdjectives"],
    }),
    addIrregularAdjective: builder.mutation<
      string | null,
      {
        langCode: string;
        baseForm?: string;
        comparative?: string;
        superlative?: string;
        irregularAdjectiveId?: string;
      }
    >({
      query: ({ langCode, baseForm, comparative, superlative, irregularAdjectiveId }) => ({
        url: "/dictionary/irregular-adjectives",
        method: "POST",
        body: {
          langCode,
          baseForm: baseForm ?? "",
          comparative: comparative ?? "",
          superlative: superlative ?? "",
          irregularAdjectiveId,
        },
      }),
      invalidatesTags: ["IrregularAdjectives"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dictionaryApi.util.invalidateTags(["DictionaryStats", "Words"]));
        dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
      },
    }),
    updateIrregularAdjectiveDefinition: builder.mutation<
      { success: boolean },
      {
        langCode: string;
        irregularAdjectiveId: string;
        definition?: string;
        phoneticText?: string;
        phoneticAudioLink?: string;
      }
    >({
      query: ({ langCode, irregularAdjectiveId, definition, phoneticText, phoneticAudioLink }) => ({
        url: `/dictionary/irregular-adjectives/${irregularAdjectiveId}/definition`,
        method: "PATCH",
        body: {
          langCode,
          definition: definition || undefined,
          phoneticText: phoneticText || undefined,
          phoneticAudioLink: phoneticAudioLink || undefined,
        },
      }),
      invalidatesTags: ["IrregularAdjectives"],
    }),
    updateIrregularAdjectiveTranslation: builder.mutation<
      { success: boolean },
      {
        langCode: string;
        targetLangCode: string;
        irregularAdjectiveId: string;
        definition: string;
        translationsText: string;
      }
    >({
      query: ({
        langCode,
        targetLangCode,
        irregularAdjectiveId,
        definition,
        translationsText,
      }) => ({
        url: `/dictionary/irregular-adjectives/${irregularAdjectiveId}/translation`,
        method: "PATCH",
        body: {
          langCode,
          targetLangCode,
          definition,
          translationsText,
        },
      }),
      invalidatesTags: ["IrregularAdjectives"],
    }),
    reloadIrregularAdjectiveDefinition: builder.mutation<
      {
        definition: string;
        phoneticText: string;
        phoneticAudioLink: string;
      },
      { langCode: string; irregularAdjectiveId: string }
    >({
      query: ({ langCode, irregularAdjectiveId }) => ({
        url: `/dictionary/irregular-adjectives/${irregularAdjectiveId}/reload-definition`,
        method: "POST",
        body: { langCode },
      }),
      invalidatesTags: ["IrregularAdjectives"],
    }),
    reloadIrregularAdjectiveTranslation: builder.mutation<
      { translatedText: string },
      {
        langCode: string;
        irregularAdjectiveId: string;
        targetLangCode?: string;
      }
    >({
      query: ({ langCode, irregularAdjectiveId, targetLangCode = "uk" }) => ({
        url: `/dictionary/irregular-adjectives/${irregularAdjectiveId}/reload-translation`,
        method: "POST",
        body: { langCode, targetLangCode },
      }),
      invalidatesTags: ["IrregularAdjectives"],
    }),
  }),
});

export const {
  useFetchIrregularAdjectivesPageQuery,
  useUpdateIrregularAdjectiveStatusMutation,
  useRemoveIrregularAdjectiveFromDictionaryMutation,
  useAddIrregularAdjectiveMutation,
  useUpdateIrregularAdjectiveDefinitionMutation,
  useUpdateIrregularAdjectiveTranslationMutation,
  useReloadIrregularAdjectiveDefinitionMutation,
  useReloadIrregularAdjectiveTranslationMutation,
} = irregularAdjectiveApi;
