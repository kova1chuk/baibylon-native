import { createApi } from "@reduxjs/toolkit/query/react";

import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

interface NestResponse<T> {
  success: boolean;
  data: T;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: "pending" | "active" | "canceled" | "past_due";
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionResponse {
  status: string;
  subscription: Subscription | null;
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    getSubscription: builder.query<SubscriptionResponse, void>({
      query: () => ({ url: "/payments/subscription" }),
      providesTags: ["Subscription"],
      transformResponse: (response: NestResponse<SubscriptionResponse>) => response.data,
    }),
  }),
});

export const { useGetSubscriptionQuery } = subscriptionApi;
