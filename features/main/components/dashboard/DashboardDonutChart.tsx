import React from 'react';

import Svg, { Circle, G, Path } from 'react-native-svg';
import { Text, View, XStack, YStack, Spinner } from 'tamagui';

import { useTheme } from '@/contexts/ThemeContext';
import { useDictionaryStats } from '@/lib/api';

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

const STATUS_COLORS: Record<keyof Omit<WordStats, 'total'>, string> = {
  notLearned: '#6B7280',
  beginner: '#EF4444',
  basic: '#F97316',
  intermediate: '#F59E0B',
  advanced: '#3B82F6',
  wellKnown: '#10B981',
  mastered: '#8B5CF6',
};

const STATUS_LABELS: Record<keyof Omit<WordStats, 'total'>, string> = {
  notLearned: 'Not Learned',
  beginner: 'Beginner',
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  wellKnown: 'Well Known',
  mastered: 'Mastered',
};

export default function DashboardDonutChart() {
  const { theme } = useTheme();
  const { data: statsData, isLoading } = useDictionaryStats('en');

  if (isLoading) {
    return (
      <View alignItems="center" justifyContent="center" height={200}>
        <Spinner size="small" />
      </View>
    );
  }

  const stats: WordStats = {
    notLearned: statsData?.wordStats?.['1'] || 0,
    beginner: statsData?.wordStats?.['2'] || 0,
    basic: statsData?.wordStats?.['3'] || 0,
    intermediate: statsData?.wordStats?.['4'] || 0,
    advanced: statsData?.wordStats?.['5'] || 0,
    wellKnown: statsData?.wordStats?.['6'] || 0,
    mastered: statsData?.wordStats?.['7'] || 0,
    total: statsData?.totalWords || 0,
  };

  const chartData = [
    {
      key: 'notLearned',
      value: stats.notLearned,
      color: STATUS_COLORS.notLearned,
    },
    { key: 'beginner', value: stats.beginner, color: STATUS_COLORS.beginner },
    { key: 'basic', value: stats.basic, color: STATUS_COLORS.basic },
    {
      key: 'intermediate',
      value: stats.intermediate,
      color: STATUS_COLORS.intermediate,
    },
    { key: 'advanced', value: stats.advanced, color: STATUS_COLORS.advanced },
    {
      key: 'wellKnown',
      value: stats.wellKnown,
      color: STATUS_COLORS.wellKnown,
    },
    { key: 'mastered', value: stats.mastered, color: STATUS_COLORS.mastered },
  ].filter(item => item.value > 0);

  const size = 200;
  const center = size / 2;
  const radius = 80;
  const innerRadius = 60;
  const total = chartData.reduce((sum, item) => sum + item.value, 0) || 1;
  const bgColor = theme === 'dark' ? '#0A0A0F' : '#FFFFFF';

  const generatePath = (startAngle: number, endAngle: number, r: number) => {
    const x1 = center + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = center + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = center + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = center + r * Math.sin((endAngle * Math.PI) / 180);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = -90;
  const segments = chartData.map(item => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    return { ...item, path: generatePath(startAngle, endAngle, radius) };
  });

  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      marginHorizontal="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={2}
      elevation={1}
    >
      <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$3">
        Word Status
      </Text>

      <XStack alignItems="center" gap="$4">
        {/* Donut chart */}
        <View position="relative" alignItems="center" justifyContent="center">
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <G>
              {segments.map(segment => (
                <Path
                  key={segment.key}
                  d={segment.path}
                  fill={segment.color}
                  stroke={bgColor}
                  strokeWidth={2}
                />
              ))}
              <Circle cx={center} cy={center} r={innerRadius} fill={bgColor} />
            </G>
          </Svg>
          <View
            position="absolute"
            alignItems="center"
            justifyContent="center"
            width={120}
            height={120}
          >
            <Text fontSize="$8" fontWeight="bold" color="$color">
              {stats.total}
            </Text>
            <Text fontSize="$2" opacity={0.5}>
              total
            </Text>
          </View>
        </View>

        {/* Legend */}
        <YStack flex={1} gap="$2">
          {Object.entries(STATUS_LABELS).map(([key, label]) => {
            const count = stats[key as keyof Omit<WordStats, 'total'>];
            const color = STATUS_COLORS[key as keyof Omit<WordStats, 'total'>];
            return (
              <XStack key={key} alignItems="center" gap="$2">
                <View
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={color}
                />
                <Text fontSize="$2" flex={1} opacity={0.7}>
                  {label}
                </Text>
                <Text fontSize="$2" fontWeight="600" color="$color">
                  {count}
                </Text>
              </XStack>
            );
          })}
        </YStack>
      </XStack>
    </YStack>
  );
}
