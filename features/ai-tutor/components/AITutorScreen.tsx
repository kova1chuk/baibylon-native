import React, { useCallback, useEffect, useRef } from "react";

import { useRouter } from "expo-router";
import { ArrowLeft, BarChart3 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import {
  useEndTutorSessionMutation,
  useGetTutorPreferencesQuery,
  useStartTutorSessionMutation,
} from "@/shared/api/tutorApi";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";

import { useColors } from "@/hooks/useColors";

import {
  endSession,
  recordQuizResult,
  setAllPreferences,
  setMode,
  setView,
  startSession,
  updateElapsedMinutes,
} from "../model/aiTutorSlice";
import type { TutorMode } from "../model/aiTutorSlice";

import ChatScreen from "./ChatScreen";
import WelcomeView from "./WelcomeView";

export default function AITutorScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = useColors();
  const dispatch = useAppDispatch();

  const view = useAppSelector((state) => state.aiTutor.view);
  const mode = useAppSelector((state) => state.aiTutor.mode);
  const sessionStats = useAppSelector((state) => state.aiTutor.sessionStats);
  const currentSessionId = useAppSelector((state) => state.aiTutor.currentSessionId);
  const preferences = useAppSelector((state) => state.aiTutor.preferences);

  const [startTutorSession] = useStartTutorSessionMutation();
  const [endTutorSession] = useEndTutorSessionMutation();
  const { data: serverPrefs } = useGetTutorPreferencesQuery();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (serverPrefs) {
      dispatch(
        setAllPreferences({
          enableSuggestions: serverPrefs.enableSuggestions,
          autoCorrect: serverPrefs.autoCorrect,
          showTranslations: serverPrefs.showTranslations,
          difficulty: serverPrefs.difficulty,
          sessionLength: serverPrefs.sessionLength,
        }),
      );
    }
  }, [serverPrefs, dispatch]);

  useEffect(() => {
    if (view === "chat" && currentSessionId) {
      timerRef.current = setInterval(() => {
        dispatch(
          updateElapsedMinutes(
            Math.floor((Date.now() - new Date(sessionStats.startedAt || "").getTime()) / 60000),
          ),
        );
      }, 60000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [view, currentSessionId, sessionStats.startedAt, dispatch]);

  useEffect(() => {
    return () => {
      if (currentSessionId) {
        endTutorSession(currentSessionId).catch(() => {});
        dispatch(endSession());
      }
    };
  }, [currentSessionId, endTutorSession, dispatch]);

  const handleStartChat = useCallback(async () => {
    try {
      const sessionId = await startTutorSession({ mode }).unwrap();
      dispatch(startSession(sessionId));
    } catch {
      dispatch(setView("chat"));
    }
  }, [mode, startTutorSession, dispatch]);

  const handleModeChange = useCallback(
    (newMode: TutorMode) => {
      dispatch(setMode(newMode));
    },
    [dispatch],
  );

  const handleBack = useCallback(() => {
    if (view === "chat") {
      if (currentSessionId) {
        endTutorSession(currentSessionId).catch(() => {});
        dispatch(endSession());
      }
      dispatch(setView("welcome"));
    } else {
      router.back();
    }
  }, [view, currentSessionId, endTutorSession, dispatch, router]);

  const handleQuizResult = useCallback(
    (correct: boolean, word: string) => {
      dispatch(recordQuizResult({ correct, word }));
    },
    [dispatch],
  );

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top + 8, backgroundColor: colors.background }}
    >
      <View className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={handleBack} className="p-2 active:opacity-50">
          <ArrowLeft size={20} color={isDark ? "#FAFAF9" : "#111827"} />
        </Pressable>

        <Text className="text-base font-semibold text-foreground">{t("aiTutor.title")}</Text>

        {view === "chat" ? (
          <View className="flex-row items-center gap-3">
            <Text className="text-xs text-muted-foreground">
              {sessionStats.correctCount}/{sessionStats.totalCount}
            </Text>
            <BarChart3 size={18} color={isDark ? "#A1A1AA" : "#6B7280"} />
          </View>
        ) : (
          <View className="w-10" />
        )}
      </View>

      {view === "welcome" ? (
        <WelcomeView mode={mode} onModeChange={handleModeChange} onStartChat={handleStartChat} />
      ) : (
        <ChatScreen
          enableSuggestions={preferences.enableSuggestions}
          onQuizResult={handleQuizResult}
        />
      )}
    </View>
  );
}
