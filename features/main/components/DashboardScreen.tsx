import React from 'react';

import { RefreshCw } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Text,
  XStack,
  YStack,
  ScrollView,
  useTheme as useTamaguiTheme,
} from 'tamagui';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import {
  DashboardHero,
  DashboardMetrics,
  DashboardDonutChart,
  QuickActions,
  StreakTracker,
  WordOfTheMoment,
  ActivityHeatmap,
  EnglishSkillsChart,
} from './dashboard';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const tamaguiTheme = useTamaguiTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Small delay to show refresh animation
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20,
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingTop={insets.top + 16}
        paddingBottom="$2"
      >
        <Text
          fontSize="$3"
          fontWeight="600"
          color="$color"
          opacity={0.5}
          textTransform="uppercase"
          letterSpacing={1}
        >
          Dashboard
        </Text>
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          onPress={handleRefresh}
          disabled={refreshing}
          opacity={refreshing ? 0.5 : 1}
        >
          <RefreshCw size={20} color={tamaguiTheme.color?.val} />
        </Button>
      </XStack>

      <YStack gap="$4" paddingTop="$2" paddingBottom="$4">
        {/* 1. Hero greeting */}
        <DashboardHero />

        {/* 2. Metrics cards */}
        <DashboardMetrics />

        {/* 3. Donut chart */}
        <DashboardDonutChart />

        {/* 4. Quick actions */}
        <QuickActions />

        {/* 5. Streak tracker */}
        <StreakTracker />

        {/* 6. Word of the moment */}
        <WordOfTheMoment />

        {/* 7. Activity heatmap */}
        <ActivityHeatmap />

        {/* 8. English skills */}
        <EnglishSkillsChart />
      </YStack>
    </ScrollView>
  );
}
