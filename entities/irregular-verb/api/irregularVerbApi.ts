import { createApi } from '@reduxjs/toolkit/query/react';

import { dictionaryApi } from '@/entities/dictionary/api/dictionaryApi';
import { dashboardApi } from '@/features/hub/api/dashboardApi';
import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

import type {
  FetchIrregularVerbsPageResponse,
  FetchIrregularVerbsPageParams,
  DictionaryIrregularVerbRow,
} from './types';

import type { WordStatus } from '@/shared/types';

export const irregularVerbApi = createApi({
  reducerPath: 'irregularVerbApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['IrregularVerbs'],
  endpoints: builder => ({
    fetchIrregularVerbsPage: builder.query<
      FetchIrregularVerbsPageResponse,
      FetchIrregularVerbsPageParams
    >({
      query: ({
        page,
        pageSize,
        statusFilter = [],
        search = '',
        langCode = 'en',
        translationLang = 'uk',
      }) => ({
        url: '/dictionary/irregular-verbs',
        params: {
          langCode,
          translationLang,
          limitCount: pageSize,
          offsetCount: (page - 1) * pageSize,
          searchText: search || undefined,
          statusFilter:
            statusFilter.length > 0 ? statusFilter.join(',') : undefined,
        },
      }),
      providesTags: (result, error, arg) => {
        return [{ type: 'IrregularVerbs', id: arg.page }];
      },
      transformResponse: (
        response: DictionaryIrregularVerbRow[],
        _meta,
        arg: FetchIrregularVerbsPageParams
      ) => {
        const rows = response || [];
        const totalIrregularVerbs =
          rows.length > 0 ? Number(rows[0].total_count) : 0;

        const irregularVerbs = rows.map(row => ({
          id: row.irregular_verb_id,
          baseForm: row.base_form,
          pastSimple: row.past_simple,
          pastParticiple: row.past_participle,
          definition: row.definition,
          translation: row.translation,
          status: parseInt(row.status) as WordStatus,
          userId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phonetic: {
            text: row.phonetic_text,
            audio: row.phonetic_audio_link,
          },
          usageCount: row.usagecount,
        }));

        return {
          irregularVerbs,
          totalIrregularVerbs,
          page: arg.page,
          hasMore: arg.page * arg.pageSize < totalIrregularVerbs,
        };
      },
    }),
    updateIrregularVerbStatus: builder.mutation<
      void,
      { langCode: string; irregularVerbId: string; newStatus: string }
    >({
      query: ({ langCode, irregularVerbId, newStatus }) => ({
        url: `/dictionary/irregular-verbs/${irregularVerbId}/status`,
        method: 'PATCH',
        body: { langCode, newStatus },
      }),
      invalidatesTags: ['IrregularVerbs'],
    }),
    removeIrregularVerbFromDictionary: builder.mutation<
      void,
      { langCode: string; irregularVerbId: string }
    >({
      query: ({ langCode, irregularVerbId }) => ({
        url: `/dictionary/irregular-verbs/${irregularVerbId}`,
        method: 'DELETE',
        params: { langCode },
      }),
      invalidatesTags: ['IrregularVerbs'],
    }),
    addIrregularVerb: builder.mutation<
      string | null,
      {
        langCode: string;
        baseForm?: string;
        pastSimple?: string;
        pastParticiple?: string;
        irregularVerbId?: string;
      }
    >({
      query: ({
        langCode,
        baseForm,
        pastSimple,
        pastParticiple,
        irregularVerbId,
      }) => ({
        url: '/dictionary/irregular-verbs',
        method: 'POST',
        body: {
          langCode,
          baseForm: baseForm ?? '',
          pastSimple: pastSimple ?? '',
          pastParticiple: pastParticiple ?? '',
          irregularVerbId,
        },
      }),
      invalidatesTags: ['IrregularVerbs'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['DictionaryStats', 'Words'])
        );
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
      },
    }),
    updateIrregularVerbDefinition: builder.mutation<
      { success: boolean },
      {
        langCode: string;
        irregularVerbId: string;
        definition?: string;
        phoneticText?: string;
        phoneticAudioLink?: string;
      }
    >({
      query: ({
        langCode,
        irregularVerbId,
        definition,
        phoneticText,
        phoneticAudioLink,
      }) => ({
        url: `/dictionary/irregular-verbs/${irregularVerbId}/definition`,
        method: 'PATCH',
        body: {
          langCode,
          definition: definition || undefined,
          phoneticText: phoneticText || undefined,
          phoneticAudioLink: phoneticAudioLink || undefined,
        },
      }),
      invalidatesTags: ['IrregularVerbs'],
    }),
    updateIrregularVerbTranslation: builder.mutation<
      { success: boolean },
      {
        langCode: string;
        targetLangCode: string;
        irregularVerbId: string;
        definition: string;
        translationsText: string;
      }
    >({
      query: ({
        langCode,
        targetLangCode,
        irregularVerbId,
        definition,
        translationsText,
      }) => ({
        url: `/dictionary/irregular-verbs/${irregularVerbId}/translation`,
        method: 'PATCH',
        body: {
          langCode,
          targetLangCode,
          definition,
          translationsText,
        },
      }),
      invalidatesTags: ['IrregularVerbs'],
    }),
    reloadIrregularVerbDefinition: builder.mutation<
      { definition: string; phoneticText: string; phoneticAudioLink: string },
      { langCode: string; irregularVerbId: string }
    >({
      query: ({ langCode, irregularVerbId }) => ({
        url: `/dictionary/irregular-verbs/${irregularVerbId}/reload-definition`,
        method: 'POST',
        body: { langCode },
      }),
      invalidatesTags: ['IrregularVerbs'],
    }),
    reloadIrregularVerbTranslation: builder.mutation<
      { translatedText: string },
      { langCode: string; irregularVerbId: string; targetLangCode?: string }
    >({
      query: ({ langCode, irregularVerbId, targetLangCode = 'uk' }) => ({
        url: `/dictionary/irregular-verbs/${irregularVerbId}/reload-translation`,
        method: 'POST',
        body: { langCode, targetLangCode },
      }),
      invalidatesTags: ['IrregularVerbs'],
    }),
  }),
});

export const {
  useFetchIrregularVerbsPageQuery,
  useUpdateIrregularVerbStatusMutation,
  useRemoveIrregularVerbFromDictionaryMutation,
  useAddIrregularVerbMutation,
  useUpdateIrregularVerbDefinitionMutation,
  useUpdateIrregularVerbTranslationMutation,
  useReloadIrregularVerbDefinitionMutation,
  useReloadIrregularVerbTranslationMutation,
} = irregularVerbApi;
