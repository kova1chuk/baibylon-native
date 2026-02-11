import React from 'react';

import { RefreshCw, Menu } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path } from 'react-native-svg';
import {
  Button,
  Text,
  View,
  XStack,
  YStack,
  useTheme as useTamaguiTheme,
  Spinner,
  ScrollView,
} from 'tamagui';

import { useTheme } from '@/contexts/ThemeContext';
import { useDictionaryStats } from '@/lib/api';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

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

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const tamaguiTheme = useTamaguiTheme();
  const router = useRouter();
  const { theme } = useTheme();

  const {
    data: statsData,
    isLoading: loading,
    isRefetching: refreshing,
    refetch,
  } = useDictionaryStats('en');

  const handleRefresh = () => {
    refetch();
  };

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

  const size = 280;
  const center = size / 2;
  const radius = 100;
  const innerRadius = 80;

  const total = chartData.reduce((sum, item) => sum + item.value, 0) || 1;

  const generatePath = (
    startAngle: number,
    endAngle: number,
    isInner: boolean
  ) => {
    const r = isInner ? innerRadius : radius;
    const x1 = center + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = center + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = center + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = center + r * Math.sin((endAngle * Math.PI) / 180);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = -90;
  const segments =
    total > 0
      ? chartData.map(item => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          return {
            ...item,
            startAngle,
            endAngle,
            outerPath: generatePath(startAngle, endAngle, false),
            innerPath: generatePath(startAngle, endAngle, true),
          };
        })
      : [];

  if (loading) {
    return (
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$background"
      >
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        paddingBottom: tabBarHeight,
        flexGrow: 1,
      }}
    >
      {}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingTop={insets.top + 16}
        paddingBottom="$2"
      >
        <Text fontSize="$8" fontWeight="bold" color="$color">
          Word Flow
        </Text>
        <XStack gap="$3">
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            onPress={handleRefresh}
            disabled={refreshing}
            opacity={refreshing ? 0.5 : 1}
          >
            <RefreshCw size={24} color={tamaguiTheme.color?.val} />
          </Button>
          <Button size="$3" circular backgroundColor="transparent">
            <Menu size={24} color={tamaguiTheme.color?.val} />
          </Button>
        </XStack>
      </XStack>

      <YStack gap="$4" padding="$4">
        {}
        <View
          alignItems="center"
          justifyContent="center"
          paddingVertical="$6"
          backgroundColor="$background"
          position="relative"
        >
          <View position="relative" alignItems="center" justifyContent="center">
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <G>
                {segments.map(segment => (
                  <Path
                    key={segment.key}
                    d={segment.outerPath}
                    fill={segment.color}
                    stroke={theme === 'dark' ? '#0F172A' : '#FFFFFF'}
                    strokeWidth={2}
                  />
                ))}
                {}
                <Circle
                  cx={center}
                  cy={center}
                  r={innerRadius}
                  fill={theme === 'dark' ? '#0F172A' : '#FFFFFF'}
                />
              </G>
            </Svg>
            <View
              position="absolute"
              alignItems="center"
              justifyContent="center"
              width={160}
              height={160}
            >
              <Text fontSize="$10" fontWeight="bold" color="$color">
                {stats.total}
              </Text>
            </View>
          </View>
        </View>

        {}
        <YStack
          gap="$3"
          backgroundColor="$background"
          padding="$4"
          borderRadius="$4"
        >
          <Text fontSize="$6" fontWeight="600" color="$color">
            Word Status Distribution
          </Text>
          <YStack gap="$2">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = stats[key as keyof Omit<WordStats, 'total'>];
              const color =
                STATUS_COLORS[key as keyof Omit<WordStats, 'total'>];
              return (
                <XStack
                  key={key}
                  alignItems="center"
                  justifyContent="space-between"
                  gap="$3"
                >
                  <XStack alignItems="center" gap="$3">
                    <View
                      width={12}
                      height={12}
                      borderRadius={6}
                      backgroundColor={color}
                    />
                    <Text fontSize="$4" color="$color">
                      {label}
                    </Text>
                  </XStack>
                  <Text fontSize="$4" fontWeight="600" color="$color">
                    {count}
                  </Text>
                </XStack>
              );
            })}
          </YStack>
        </YStack>

        {}
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="600" color="$color" marginBottom="$2">
            Quick Actions
          </Text>
          <Button
            size="$5"
            backgroundColor="$blue10"
            color="white"
            fontWeight="600"
            onPress={() => router.push('/(tabs)/explore')}
          >
            Dictionary
          </Button>
          <Button
            size="$5"
            backgroundColor="$gray8"
            color="$color"
            fontWeight="600"
            onPress={() => router.push('/training')}
          >
            Training Words
          </Button>
          <Button
            size="$5"
            backgroundColor="$gray8"
            color="$color"
            fontWeight="600"
            onPress={() => router.push('/reviews')}
          >
            Reviews
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
