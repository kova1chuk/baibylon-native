import React from "react";

import { useTranslation } from "react-i18next";

import { View, Text } from "react-native";

import type { UserDictionaryStatsResponse } from "@/entities/dictionary/api/types";

interface WordStats {
  notLearned: number;
  beginner: number;
  basic: number;
  intermediate: number;
  advanced: number;
  wellKnown: number;
  mastered: number;
  total: number;
}

const STATUS_COLORS: Record<keyof Omit<WordStats, "total">, string> = {
  notLearned: "#6B7280",
  beginner: "#EF4444",
  basic: "#F97316",
  intermediate: "#F59E0B",
  advanced: "#3B82F6",
  wellKnown: "#10B981",
  mastered: "#8B5CF6",
};

const STATUS_LABEL_KEYS: Record<keyof Omit<WordStats, "total">, string> = {
  notLearned: "wordStatus.notStarted",
  beginner: "wordStatus.introduced",
  basic: "wordStatus.encountered",
  intermediate: "wordStatus.learning",
  advanced: "wordStatus.familiar",
  wellKnown: "wordStatus.confident",
  mastered: "wordStatus.mastered",
};

interface Props {
  statsData?: UserDictionaryStatsResponse | null;
}

export default function DashboardDonutChart({ statsData }: Props) {
  const { t } = useTranslation();

  const stats: WordStats = {
    notLearned: statsData?.wordStats?.["1"] || 0,
    beginner: statsData?.wordStats?.["2"] || 0,
    basic: statsData?.wordStats?.["3"] || 0,
    intermediate: statsData?.wordStats?.["4"] || 0,
    advanced: statsData?.wordStats?.["5"] || 0,
    wellKnown: statsData?.wordStats?.["6"] || 0,
    mastered: statsData?.wordStats?.["7"] || 0,
    total: statsData?.totalWords || 0,
  };

  return (
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <Text className="text-lg font-semibold text-foreground mb-3">
        {t("dashboard.wordStatusDistribution")}
      </Text>

      <View className="flex-row items-center gap-4">
        <View className="items-center justify-center w-[160px] h-[160px] rounded-full border-4 border-muted">
          <Text className="text-2xl font-bold text-foreground">{stats.total}</Text>
          <Text className="text-xs text-muted-foreground">
            {t("dashboard.totalWords").toLowerCase()}
          </Text>
        </View>

        <View className="flex-1 gap-2">
          {(Object.keys(STATUS_LABEL_KEYS) as (keyof Omit<WordStats, "total">)[]).map((key) => {
            const count = stats[key];
            const color = STATUS_COLORS[key];
            return (
              <View key={key} className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <Text className="text-xs flex-1 text-muted-foreground">
                  {t(STATUS_LABEL_KEYS[key])}
                </Text>
                <Text className="text-xs font-semibold text-foreground">{count}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
