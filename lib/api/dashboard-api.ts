import { useState, useEffect, useCallback } from 'react';

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

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await supabaseRpcQuery<DashboardSummary>({
        functionName: 'get_dashboard_summary',
      });
      setData(
        response || {
          total_words: 0,
          words_learned: 0,
          current_streak: 0,
          grammar_level: 'A1',
          topics_completed: 0,
        }
      );
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useActivityHeatmap(weeks: number = 12) {
  const [data, setData] = useState<ActivityDay[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await supabaseRpcQuery<ActivityDay[]>({
        functionName: 'get_activity_heatmap',
        args: { p_weeks: weeks },
      });
      setData(response || []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [weeks]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
