import { createApi } from "@reduxjs/toolkit/query/react";

import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

import type {
  ActivityHeatmapData,
  DashboardHomeResponse,
  DashboardSummary,
} from "../types/dashboard";

interface NestResponse<T> {
  success: boolean;
  data: T;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardHome: builder.query<DashboardHomeResponse, void>({
      query: () => ({ url: "/dashboard/home" }),
      providesTags: ["Dashboard"],
      transformResponse: (response: NestResponse<DashboardHomeResponse>) => response.data,
    }),
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => ({ url: "/dashboard/summary" }),
      providesTags: ["Dashboard"],
      transformResponse: (response: NestResponse<DashboardSummary>) => response.data,
    }),
    getActivityHeatmap: builder.query<ActivityHeatmapData[], { weeks: number }>({
      query: ({ weeks }) => ({
        url: `/dashboard/activity-heatmap?weeks=${weeks}`,
      }),
      providesTags: ["Dashboard"],
      transformResponse: (response: NestResponse<ActivityHeatmapData[]>) => response.data,
    }),
  }),
});

export const { useGetDashboardHomeQuery, useGetDashboardSummaryQuery, useGetActivityHeatmapQuery } =
  dashboardApi;
