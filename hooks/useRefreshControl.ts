import { useState, useCallback } from "react";

/**
 * Returns { refreshing, onRefresh } for ScrollView/FlatList RefreshControl.
 */
export function useRefreshControl(refetchFns: (() => Promise<unknown> | unknown)[]) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(refetchFns.map((fn) => fn()));
    } finally {
      setRefreshing(false);
    }
  }, refetchFns);

  return { refreshing, onRefresh };
}
