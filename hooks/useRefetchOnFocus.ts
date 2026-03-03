import { useCallback, useRef } from "react";

import { useFocusEffect } from "expo-router";

/**
 * Silently refetches queries when screen gains focus.
 * Skips the initial mount to avoid double-fetching.
 */
export function useRefetchOnFocus(refetchFns: (() => void)[]) {
  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetchFns.forEach((fn) => fn());
    }, refetchFns),
  );
}
