import React from "react";

import { useTranslation } from "react-i18next";

import { Text, View } from "react-native";

import type { DashboardSummary } from "@/features/hub/types/dashboard";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  borderColor: string;
}

function MetricCard({ label, value, subtitle, borderColor }: MetricCardProps) {
  return (
    <View
      className="flex-1 bg-card rounded-2xl p-3 shadow-sm"
      style={{ borderTopWidth: 3, borderTopColor: borderColor }}
    >
      <Text className="text-sm text-muted-foreground mb-1">{label}</Text>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      {subtitle && <Text className="text-xs text-muted-foreground mt-1">{subtitle}</Text>}
    </View>
  );
}

interface Props {
  data?: DashboardSummary | null;
}

export default function DashboardMetrics({ data }: Props) {
  const { t } = useTranslation();

  const totalWords = data?.total_words ?? 0;
  const learned = data?.words_learned ?? 0;
  const learnedPct = totalWords > 0 ? Math.round((learned / totalWords) * 100) : 0;
  const grammar = data?.grammar_level ?? "A1";

  return (
    <View className="gap-3 px-4">
      <View className="flex-row gap-3">
        <MetricCard
          label={t("dashboard.totalWords")}
          value={String(totalWords)}
          borderColor="#10B981"
        />
        <MetricCard
          label={t("dashboard.learned")}
          value={String(learned)}
          subtitle={t("dashboard.ofTotal", { percent: learnedPct })}
          borderColor="#3B82F6"
        />
      </View>
      <View className="flex-row gap-3">
        <MetricCard label={t("dashboard.grammarLabel")} value={grammar} borderColor="#8B5CF6" />
      </View>
    </View>
  );
}
