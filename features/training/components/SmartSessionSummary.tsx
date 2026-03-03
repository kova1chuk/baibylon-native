import React from "react";

import { CheckCircle, Clock, XCircle, Zap } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { useColors } from "@/hooks/useColors";

interface SmartSessionSummaryProps {
  stats: {
    total: number;
    correct: number;
    wrong: number;
    accuracy: number;
    typeCounts: Record<string, number>;
  };
  elapsedSeconds: number;
  streakBest: number;
  onContinue: () => void;
  onRetryMistakes: () => void;
  onDone: () => void;
  hasWrongAnswers: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function SmartSessionSummary({
  stats,
  elapsedSeconds,
  streakBest,
  onContinue,
  onRetryMistakes,
  onDone,
  hasWrongAnswers,
}: SmartSessionSummaryProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = useColors();

  const getPerformanceLevel = () => {
    if (stats.accuracy >= 90)
      return { color: "#10B981", labelKey: "trainingSummary.excellentWork" };
    if (stats.accuracy >= 70) return { color: "#3B82F6", labelKey: "trainingSummary.goodJob" };
    return { color: "#F59E0B", labelKey: "trainingSummary.dontWorry" };
  };

  const perf = getPerformanceLevel();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
    >
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t("trainingSummary.trainingComplete")}
        </Text>
        <Text className="text-base text-muted-foreground text-center">{t(perf.labelKey)}</Text>
      </View>

      <View className="items-center mb-8">
        <View
          className="w-28 h-28 rounded-full items-center justify-center"
          style={{ borderWidth: 4, borderColor: perf.color }}
        >
          <Text className="text-4xl font-bold" style={{ color: perf.color }}>
            {stats.accuracy}%
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground mt-2">{t("trainingSummary.accuracy")}</Text>
      </View>

      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-card rounded-2xl p-4 items-center">
          <CheckCircle size={24} color="#10B981" />
          <Text className="text-2xl font-bold text-foreground mt-2">{stats.correct}</Text>
          <Text className="text-xs text-muted-foreground">{t("trainingSummary.correct")}</Text>
        </View>
        <View className="flex-1 bg-card rounded-2xl p-4 items-center">
          <XCircle size={24} color="#EF4444" />
          <Text className="text-2xl font-bold text-foreground mt-2">{stats.wrong}</Text>
          <Text className="text-xs text-muted-foreground">{t("training.wrong")}</Text>
        </View>
        <View className="flex-1 bg-card rounded-2xl p-4 items-center">
          <Clock size={24} color={isDark ? "#A1A1AA" : "#6B7280"} />
          <Text className="text-2xl font-bold text-foreground mt-2">
            {formatTime(elapsedSeconds)}
          </Text>
          <Text className="text-xs text-muted-foreground">{t("training.time")}</Text>
        </View>
        <View className="flex-1 bg-card rounded-2xl p-4 items-center">
          <Zap size={24} color="#F59E0B" />
          <Text className="text-2xl font-bold text-foreground mt-2">{streakBest}</Text>
          <Text className="text-xs text-muted-foreground">{t("training.bestStreak")}</Text>
        </View>
      </View>

      <View className="gap-3 mt-auto">
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={onContinue}
        >
          <Text className="text-white font-semibold text-base">
            {t("learningFeed.continueTraining")}
          </Text>
        </Pressable>

        {hasWrongAnswers && (
          <Pressable
            className="border border-border rounded-xl py-4 items-center active:opacity-80"
            onPress={onRetryMistakes}
          >
            <Text className="text-foreground font-semibold text-base">{t("common.retry")}</Text>
          </Pressable>
        )}

        <Pressable className="py-4 items-center active:opacity-50" onPress={onDone}>
          <Text className="text-muted-foreground font-medium text-base">
            {t("learningFeed.doneForToday")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
