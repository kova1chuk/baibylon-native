import { createApi } from "@reduxjs/toolkit/query/react";

import { dictionaryApi } from "@/entities/dictionary/api/dictionaryApi";
import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

import { dashboardApi } from "./dashboardApi";
import type {
  FetchHubIrregularAdjectivesResponse,
  FetchHubIrregularVerbsResponse,
  FetchHubItemsParams,
  FetchHubPhrasesResponse,
  FetchHubWordsResponse,
  HubIrregularAdjectiveRow,
  HubIrregularVerbRow,
  HubPhraseRow,
  HubWordRow,
} from "./types";

interface NestResponse<T> {
  success: boolean;
  data: T;
}

export const hubApi = createApi({
  reducerPath: "hubApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["HubWords", "HubPhrases", "HubIrregularVerbs", "HubIrregularAdjectives"],
  endpoints: (builder) => ({
    fetchHubWords: builder.query<FetchHubWordsResponse, FetchHubItemsParams>({
      query: ({ page, pageSize, search = "", langCode = "en", translationLang = "uk" }) => ({
        url: `/hub/words?langCode=${langCode}&translationLang=${translationLang}&limit=${pageSize}&offset=${(page - 1) * pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      }),
      providesTags: ["HubWords"],
      transformResponse: (
        response: NestResponse<HubWordRow[]>,
        _meta,
        arg: FetchHubItemsParams,
      ) => {
        const rows = response.data || [];
        const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

        const words = rows.map((row) => ({
          id: row.word_id,
          text: row.text,
          definition: row.definition || "",
          phoneticText: row.phonetic_text || "",
          phoneticAudioLink: row.phonetic_audio_link || "",
          translation: row.translation || "",
          translationDefinition: row.translation_definition || "",
          inUserDictionary: row.in_user_dictionary,
          userStatus: row.user_status || "",
        }));

        return {
          words,
          total,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < total,
        };
      },
    }),

    fetchHubPhrases: builder.query<FetchHubPhrasesResponse, FetchHubItemsParams>({
      query: ({ page, pageSize, search = "", langCode = "en", translationLang = "uk" }) => ({
        url: `/hub/phrases?langCode=${langCode}&translationLang=${translationLang}&limit=${pageSize}&offset=${(page - 1) * pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      }),
      providesTags: ["HubPhrases"],
      transformResponse: (
        response: NestResponse<HubPhraseRow[]>,
        _meta,
        arg: FetchHubItemsParams,
      ) => {
        const rows = response.data || [];
        const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

        const phrases = rows.map((row) => ({
          id: row.phrase_id,
          text: row.text,
          definition: row.definition || "",
          phoneticText: row.phonetic_text || "",
          phoneticAudioLink: row.phonetic_audio_link || "",
          translation: row.translation || "",
          translationDefinition: row.translation_definition || "",
          inUserDictionary: row.in_user_dictionary,
          userStatus: row.user_status || "",
        }));

        return {
          phrases,
          total,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < total,
        };
      },
    }),

    fetchHubIrregularVerbs: builder.query<FetchHubIrregularVerbsResponse, FetchHubItemsParams>({
      query: ({ page, pageSize, search = "", langCode = "en", translationLang = "uk" }) => ({
        url: `/hub/irregular-verbs?langCode=${langCode}&translationLang=${translationLang}&limit=${pageSize}&offset=${(page - 1) * pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      }),
      providesTags: ["HubIrregularVerbs"],
      transformResponse: (
        response: NestResponse<HubIrregularVerbRow[]>,
        _meta,
        arg: FetchHubItemsParams,
      ) => {
        const rows = response.data || [];
        const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

        const irregularVerbs = rows.map((row) => ({
          id: row.irregular_verb_id,
          baseForm: row.base_form,
          pastSimple: row.past_simple,
          pastParticiple: row.past_participle,
          definition: row.definition || "",
          phoneticText: row.phonetic_text || "",
          phoneticAudioLink: row.phonetic_audio_link || "",
          translation: row.translation || "",
          translationDefinition: row.translation_definition || "",
          inUserDictionary: row.in_user_dictionary,
          userStatus: row.user_status || "",
        }));

        return {
          irregularVerbs,
          total,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < total,
        };
      },
    }),

    fetchHubIrregularAdjectives: builder.query<
      FetchHubIrregularAdjectivesResponse,
      FetchHubItemsParams
    >({
      query: ({ page, pageSize, search = "" }) => ({
        url: `/hub/irregular-adjectives?limit=${pageSize}&offset=${(page - 1) * pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      }),
      providesTags: ["HubIrregularAdjectives"],
      transformResponse: (
        response: NestResponse<HubIrregularAdjectiveRow[]>,
        _meta,
        arg: FetchHubItemsParams,
      ) => {
        const rows = response.data || [];
        const total = rows.length > 0 ? Number(rows[0].total) : 0;

        const irregularAdjectives = rows.map((row) => ({
          id: row.id,
          baseForm: row.base_form,
          comparative: row.comparative,
          superlative: row.superlative,
          definition: row.definition || "",
          phoneticText: row.phonetic_text || "",
          phoneticAudioLink: row.phonetic_audio_link || "",
          translation: row.translation || "",
          inUserDictionary: row.in_user_dictionary,
        }));

        return {
          irregularAdjectives,
          total,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < total,
        };
      },
    }),

    addWordToDictionary: builder.mutation<
      { success: boolean },
      { langCode: string; wordId: string }
    >({
      query: ({ langCode, wordId }) => ({
        url: "/hub/add-word",
        method: "POST",
        body: { langCode, wordId },
      }),
      invalidatesTags: ["HubWords"],
      transformResponse: (response: NestResponse<{ success: boolean }>) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dictionaryApi.util.invalidateTags(["DictionaryStats", "Words"]));
        dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
      },
    }),
  }),
});

export const {
  useFetchHubWordsQuery,
  useFetchHubPhrasesQuery,
  useFetchHubIrregularVerbsQuery,
  useFetchHubIrregularAdjectivesQuery,
  useAddWordToDictionaryMutation,
} = hubApi;
