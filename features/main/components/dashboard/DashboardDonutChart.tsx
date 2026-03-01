import React from 'react';

import Svg, { Circle, G, Path } from 'react-native-svg';

import { View, Text, ActivityIndicator } from 'react-native';

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
      <View className="items-center justify-center h-[200px]">
        <ActivityIndicator size="small" />
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
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <Text className="text-lg font-semibold text-foreground mb-3">
        Word Status
      </Text>

      <View className="flex-row items-center gap-4">
        {/* Donut chart */}
        <View className="relative items-center justify-center">
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
          <View className="absolute items-center justify-center w-[120px] h-[120px]">
            <Text className="text-2xl font-bold text-foreground">
              {stats.total}
            </Text>
            <Text className="text-xs text-muted-foreground">total</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-1 gap-2">
          {Object.entries(STATUS_LABELS).map(([key, label]) => {
            const count = stats[key as keyof Omit<WordStats, 'total'>];
            const color = STATUS_COLORS[key as keyof Omit<WordStats, 'total'>];
            return (
              <View key={key} className="flex-row items-center gap-2">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <Text className="text-xs flex-1 text-muted-foreground">
                  {label}
                </Text>
                <Text className="text-xs font-semibold text-foreground">
                  {count}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
