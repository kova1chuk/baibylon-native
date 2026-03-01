import React from 'react';

import { View, Text, ActivityIndicator } from 'react-native';

import { useDashboardSummary } from '@/lib/api';

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
      {subtitle && (
        <Text className="text-xs text-muted-foreground mt-1">{subtitle}</Text>
      )}
    </View>
  );
}

export default function DashboardMetrics() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <View className="items-center justify-center h-[120px]">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const totalWords = data?.total_words ?? 0;
  const learned = data?.words_learned ?? 0;
  const learnedPct =
    totalWords > 0 ? Math.round((learned / totalWords) * 100) : 0;
  const streak = data?.current_streak ?? 0;
  const grammar = data?.grammar_level ?? 'A1';

  return (
    <View className="gap-3 px-4">
      <View className="flex-row gap-3">
        <MetricCard
          label="Total Words"
          value={String(totalWords)}
          borderColor="#10B981"
        />
        <MetricCard
          label="Learned"
          value={String(learned)}
          subtitle={`${learnedPct}% of total`}
          borderColor="#3B82F6"
        />
      </View>
      <View className="flex-row gap-3">
        <MetricCard
          label="Streak"
          value={`${streak} days`}
          borderColor="#F59E0B"
        />
        <MetricCard
          label="Grammar Level"
          value={grammar}
          borderColor="#8B5CF6"
        />
      </View>
    </View>
  );
}
