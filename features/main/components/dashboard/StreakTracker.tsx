import React from 'react';

import { Flame } from 'lucide-react-native';

import { View, Text, ActivityIndicator } from 'react-native';

import { useDashboardSummary } from '@/lib/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakTracker() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <View className="items-center justify-center h-[120px]">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const streak = data?.current_streak ?? 0;

  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

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
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <View className="flex-row items-center gap-2 mb-3">
        <Flame size={20} color="#F59E0B" />
        <Text className="text-lg font-semibold text-foreground">
          {streak} Day Streak
        </Text>
      </View>

      <View className="flex-row justify-between">
        {DAYS.map((day, idx) => {
          const isActive = activeDays.has(idx);
          const isToday = idx === todayIdx;

          return (
            <View key={day} className="items-center gap-2">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isActive
                    ? '#10B981'
                    : isToday
                      ? '#E5E7EB'
                      : 'transparent',
                  borderWidth: isToday && !isActive ? 2 : 0,
                  borderColor: '#D1D5DB',
                }}
              >
                {isActive && <Flame size={14} color="white" />}
              </View>
              <Text
                className="text-xs"
                style={{
                  opacity: isActive ? 1 : 0.4,
                  fontWeight: isToday ? '600' : '400',
                }}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
