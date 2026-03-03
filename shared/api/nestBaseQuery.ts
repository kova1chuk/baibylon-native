import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { supabase } from "@/lib/supabase";
import { API_BASE_URL } from "@/shared/config/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
    return headers;
  },
});

export const nestBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const { data, error } = await supabase.auth.refreshSession();

    if (!error && data.session) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
