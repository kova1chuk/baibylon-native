import { createApi } from '@reduxjs/toolkit/query/react';

import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

interface UserProfile {
  id: string;
  username: string | null;
  role: string | null;
  native_language: string | null;
  learning_language: string | null;
  created_at: string | null;
}

interface NestResponse<T> {
  success: boolean;
  data: T;
}

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['Profile'],
  endpoints: builder => ({
    getProfile: builder.query<UserProfile | null, void>({
      query: () => ({ url: '/account/profile' }),
      providesTags: ['Profile'],
      transformResponse: (response: NestResponse<UserProfile | null>) =>
        response.data,
    }),

    updateLanguages: builder.mutation<
      void,
      { native: string; learning: string }
    >({
      query: body => ({
        url: '/account/profile/languages',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    exportData: builder.query<string, void>({
      query: () => ({
        url: '/account/export',
        method: 'GET',
      }),
    }),

    resetProgress: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/account/reset-progress',
        method: 'POST',
      }),
    }),

    deleteAccount: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/account',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateLanguagesMutation,
  useLazyExportDataQuery,
  useResetProgressMutation,
  useDeleteAccountMutation,
} = accountApi;
