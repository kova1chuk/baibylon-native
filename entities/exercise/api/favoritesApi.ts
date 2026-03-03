import { createApi } from "@reduxjs/toolkit/query/react";

import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    getFavorites: builder.query<string[], void>({
      query: () => ({ url: "/exercises/favorites" }),
      providesTags: ["Favorites"],
    }),

    addFavorite: builder.mutation<{ success: boolean }, string>({
      query: (exerciseType) => ({
        url: `/exercises/favorites/${exerciseType}`,
        method: "POST",
      }),
      async onQueryStarted(exerciseType, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          favoritesApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            if (!draft.includes(exerciseType)) {
              draft.unshift(exerciseType);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    removeFavorite: builder.mutation<{ success: boolean }, string>({
      query: (exerciseType) => ({
        url: `/exercises/favorites/${exerciseType}`,
        method: "DELETE",
      }),
      async onQueryStarted(exerciseType, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          favoritesApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            const idx = draft.indexOf(exerciseType);
            if (idx !== -1) draft.splice(idx, 1);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } =
  favoritesApi;
