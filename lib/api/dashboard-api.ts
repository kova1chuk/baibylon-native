import { useQuery } from '@tanstack/react-query';

import { supabaseRpcQuery } from './supabase-rpc';

export interface DashboardSummary {
  total_words: number;
  words_learned: number;
  current_streak: number;
  grammar_level: string;
  topics_completed: number;
}

export interface ActivityDay {
  activity_date: string;
  session_count: number;
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  heatmap: (weeks?: number) =>
    [...dashboardKeys.all, 'heatmap', weeks] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: async (): Promise<DashboardSummary> => {
      const response = await supabaseRpcQuery<DashboardSummary>({
        functionName: 'get_dashboard_summary',
      });

      return (
        response || {
          total_words: 0,
          words_learned: 0,
          current_streak: 0,
          grammar_level: 'A1',
          topics_completed: 0,
        }
      );
    },
  });
}

export function useActivityHeatmap(weeks: number = 12) {
  return useQuery({
    queryKey: dashboardKeys.heatmap(weeks),
    queryFn: async (): Promise<ActivityDay[]> => {
      const response = await supabaseRpcQuery<ActivityDay[]>({
        functionName: 'get_activity_heatmap',
        args: { p_weeks: weeks },
      });

      return response || [];
    },
  });
}
