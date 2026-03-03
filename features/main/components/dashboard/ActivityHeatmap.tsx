import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import type { ActivityHeatmapData } from "@/features/hub/types/dashboard";

const CELL_SIZE = 14;
const CELL_GAP = 3;
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getIntensityColor(count: number, isDark: boolean): string {
  if (count === 0) return isDark ? "#1A1A2E" : "#EBEDF0";
  if (count <= 1) return isDark ? "#0E4429" : "#9BE9A8";
  if (count <= 3) return isDark ? "#006D32" : "#40C463";
  if (count <= 5) return isDark ? "#26A641" : "#30A14E";
  return isDark ? "#39D353" : "#216E39";
}

export const HEATMAP_WEEKS = 12;

interface Props {
  activityData?: ActivityHeatmapData[] | null;
}

export default function ActivityHeatmap({ activityData }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { grid, monthHeaders } = useMemo(() => {
    const dateMap = new Map<string, number>();
    (activityData || []).forEach((day) => {
      dateMap.set(day.activity_date, day.session_count);
    });

    const today = new Date();
    const weeks: { date: Date; count: number }[][] = [];
    const totalDays = HEATMAP_WEEKS * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);

    let currentWeek: { date: Date; count: number }[] = [];
    const d = new Date(startDate);

    while (d <= today) {
      const dateStr = d.toISOString().split("T")[0];
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

  return (
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <Text className="text-lg font-semibold text-foreground mb-3">
        {t("dashboard.activityLabel", { weeks: HEATMAP_WEEKS })}
      </Text>

      <View className="mb-1 h-4 relative">
        {monthHeaders.map((header, idx) => (
          <Text
            key={`${header.label}-${idx}`}
            className="text-[10px] text-muted-foreground absolute"
            style={{ left: header.weekIndex * (CELL_SIZE + CELL_GAP) }}
          >
            {header.label}
          </Text>
        ))}
      </View>

      <View className="flex-row mt-[18px]" style={{ gap: CELL_GAP }}>
        {grid.map((week, weekIdx) => (
          <View key={weekIdx} style={{ gap: CELL_GAP }}>
            {week.map((day, dayIdx) => (
              <View
                key={`${weekIdx}-${dayIdx}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 3,
                  backgroundColor: getIntensityColor(day.count, isDark),
                }}
              />
            ))}
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-end mt-2" style={{ gap: 4 }}>
        <Text className="text-[10px] text-muted-foreground">{t("dashboard.less")}</Text>
        {[0, 1, 2, 4, 6].map((count) => (
          <View
            key={count}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              borderRadius: 3,
              backgroundColor: getIntensityColor(count, isDark),
            }}
          />
        ))}
        <Text className="text-[10px] text-muted-foreground">{t("dashboard.more")}</Text>
      </View>
    </View>
  );
}
