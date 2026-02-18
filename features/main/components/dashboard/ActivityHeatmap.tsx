import React, { useMemo } from 'react';

import { Text, View, XStack, YStack, Spinner } from 'tamagui';

import { useTheme } from '@/contexts/ThemeContext';
import { useActivityHeatmap } from '@/lib/api';

const CELL_SIZE = 14;
const CELL_GAP = 3;
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getIntensityColor(count: number, isDark: boolean): string {
  if (count === 0) return isDark ? '#1A1A2E' : '#EBEDF0';
  if (count <= 1) return isDark ? '#0E4429' : '#9BE9A8';
  if (count <= 3) return isDark ? '#006D32' : '#40C463';
  if (count <= 5) return isDark ? '#26A641' : '#30A14E';
  return isDark ? '#39D353' : '#216E39';
}

export default function ActivityHeatmap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data: activityData, isLoading } = useActivityHeatmap(12);

  const { grid, monthHeaders } = useMemo(() => {
    // Build a map of date → session_count
    const dateMap = new Map<string, number>();
    (activityData || []).forEach(day => {
      dateMap.set(day.activity_date, day.session_count);
    });

    // Generate 12 weeks of dates (84 days)
    const today = new Date();
    const weeks: { date: Date; count: number }[][] = [];
    const totalDays = 12 * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Align to Monday
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);

    let currentWeek: { date: Date; count: number }[] = [];
    const d = new Date(startDate);

    while (d <= today) {
      const dateStr = d.toISOString().split('T')[0];
      currentWeek.push({ date: new Date(d), count: dateMap.get(dateStr) || 0 });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Build month headers
    const headers: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        headers.push({ label: MONTHS_SHORT[month], weekIndex: weekIdx });
        lastMonth = month;
      }
    });

    return { grid: weeks, monthHeaders: headers };
  }, [activityData]);

  if (isLoading) {
    return (
      <View alignItems="center" justifyContent="center" height={140}>
        <Spinner size="small" />
      </View>
    );
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
      <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$3">
        Activity
      </Text>

      {/* Month headers */}
      <XStack marginBottom="$1" paddingLeft={0}>
        {monthHeaders.map((header, idx) => (
          <Text
            key={`${header.label}-${idx}`}
            fontSize={10}
            opacity={0.5}
            position="absolute"
            left={header.weekIndex * (CELL_SIZE + CELL_GAP)}
          >
            {header.label}
          </Text>
        ))}
      </XStack>

      {/* Grid */}
      <XStack gap={CELL_GAP} marginTop={18}>
        {grid.map((week, weekIdx) => (
          <YStack key={weekIdx} gap={CELL_GAP}>
            {week.map((day, dayIdx) => (
              <View
                key={`${weekIdx}-${dayIdx}`}
                width={CELL_SIZE}
                height={CELL_SIZE}
                borderRadius={3}
                backgroundColor={getIntensityColor(day.count, isDark)}
              />
            ))}
          </YStack>
        ))}
      </XStack>

      {/* Legend */}
      <XStack
        alignItems="center"
        justifyContent="flex-end"
        gap="$1"
        marginTop="$2"
      >
        <Text fontSize={10} opacity={0.5}>
          Less
        </Text>
        {[0, 1, 2, 4, 6].map(count => (
          <View
            key={count}
            width={CELL_SIZE}
            height={CELL_SIZE}
            borderRadius={3}
            backgroundColor={getIntensityColor(count, isDark)}
          />
        ))}
        <Text fontSize={10} opacity={0.5}>
          More
        </Text>
      </XStack>
    </YStack>
  );
}
