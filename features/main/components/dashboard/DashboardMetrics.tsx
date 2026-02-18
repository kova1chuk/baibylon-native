import React from 'react';

import { Text, View, XStack, YStack, Spinner } from 'tamagui';

import { useDashboardSummary } from '@/lib/api';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  borderColor: string;
}

function MetricCard({ label, value, subtitle, borderColor }: MetricCardProps) {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      borderRadius="$4"
      padding="$3"
      borderTopWidth={3}
      borderTopColor={borderColor}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={2}
      elevation={1}
    >
      <Text fontSize="$3" opacity={0.6} marginBottom="$1">
        {label}
      </Text>
      <Text fontSize="$8" fontWeight="bold" color="$color">
        {value}
      </Text>
      {subtitle && (
        <Text fontSize="$2" opacity={0.5} marginTop="$1">
          {subtitle}
        </Text>
      )}
    </YStack>
  );
}

export default function DashboardMetrics() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <View alignItems="center" justifyContent="center" height={120}>
        <Spinner size="small" />
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
    <YStack gap="$3" paddingHorizontal="$4">
      <XStack gap="$3">
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
      </XStack>
      <XStack gap="$3">
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
      </XStack>
    </YStack>
  );
}
