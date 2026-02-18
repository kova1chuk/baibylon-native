import React from 'react';

import { Flame } from '@tamagui/lucide-icons';
import { Text, View, XStack, YStack, Spinner } from 'tamagui';

import { useDashboardSummary } from '@/lib/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakTracker() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <View alignItems="center" justifyContent="center" height={120}>
        <Spinner size="small" />
      </View>
    );
  }

  const streak = data?.current_streak ?? 0;

  // Determine which days in the current week are "active"
  // based on streak count (counting backwards from today)
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const todayIdx = today === 0 ? 6 : today - 1; // Convert to Mon=0 index

  const activeDays = new Set<number>();
  for (let i = 0; i < Math.min(streak, 7); i++) {
    const dayIdx = todayIdx - i;
    if (dayIdx >= 0) {
      activeDays.add(dayIdx);
    } else {
      activeDays.add(dayIdx + 7);
    }
  }

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
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <Flame size={20} color="#F59E0B" />
        <Text fontSize="$5" fontWeight="600" color="$color">
          {streak} Day Streak
        </Text>
      </XStack>

      <XStack justifyContent="space-between">
        {DAYS.map((day, idx) => {
          const isActive = activeDays.has(idx);
          const isToday = idx === todayIdx;

          return (
            <YStack key={day} alignItems="center" gap="$2">
              <View
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={
                  isActive ? '#10B981' : isToday ? '$gray5' : 'transparent'
                }
                borderWidth={isToday && !isActive ? 2 : 0}
                borderColor="$borderColor"
                alignItems="center"
                justifyContent="center"
              >
                {isActive && <Flame size={14} color="white" />}
              </View>
              <Text
                fontSize="$1"
                opacity={isActive ? 1 : 0.4}
                fontWeight={isToday ? '600' : '400'}
              >
                {day}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </YStack>
  );
}
