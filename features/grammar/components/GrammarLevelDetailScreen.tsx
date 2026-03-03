import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import {
  useGetGrammarLevelsQuery,
  useGetLevelCategoriesQuery,
  useGetCategoryTopicsQuery,
} from "@/entities/grammar/api/grammarApi";

import { useColors } from "@/hooks/useColors";
import { useRefetchOnFocus } from "@/hooks/useRefetchOnFocus";
import { useRefreshControl } from "@/hooks/useRefreshControl";

const LEVEL_COLORS: Record<string, string> = {
  A1: "#10B981",
  A2: "#059669",
  B1: "#3B82F6",
  B2: "#A855F7",
  C1: "#F59E0B",
  C2: "#EF4444",
};

const CATEGORY_COLORS = [
  "#10B981",
  "#3B82F6",
  "#A855F7",
  "#F59E0B",
  "#059669",
  "#6366F1",
  "#D97706",
];

function CategoryTopics({ categoryId, levelCode }: { categoryId: string; levelCode: string }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: topics = [], isLoading } = useGetCategoryTopicsQuery({
    categoryId,
  });

  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (topics.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-sm text-muted-foreground">No topics available yet</Text>
      </View>
    );
  }

  return (
    <View>
      {topics.map((topic) => {
        let dotColor = isDark ? "#3F3F46" : "#D1D5DB";
        let badgeColor = isDark ? "#3F3F46" : "#9CA3AF";
        let badgeLabel = "Not Started";

        if (topic.status === "in_progress") {
          dotColor = "#3B82F6";
          badgeColor = "#3B82F6";
          badgeLabel = "In Progress";
        } else if (topic.status === "completed" || topic.status === "mastered") {
          dotColor = "#10B981";
          badgeColor = "#10B981";
          badgeLabel = "Completed";
        }

        return (
          <Pressable
            key={topic.id}
            className="flex-row items-center gap-3 px-4 py-3 active:opacity-70"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#1C1C1E" : "#F3F4F6",
            }}
            onPress={() => router.push(`/grammar/topic/${topic.id}` as never)}
          >
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor }} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">{topic.name}</Text>
              {topic.description ? (
                <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                  {topic.description}
                </Text>
              ) : null}
            </View>
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: `${badgeColor}15` }}
            >
              <Text className="text-[10px] font-medium" style={{ color: badgeColor }}>
                {badgeLabel}
              </Text>
            </View>
            <ChevronRight size={14} color={isDark ? "#52525B" : "#A1A1AA"} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function GrammarLevelDetailScreen() {
  const { t } = useTranslation();
  const { levelCode: rawLevel } = useLocalSearchParams<{
    levelCode: string;
  }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = useColors();

  const levelCode = (rawLevel ?? "").toUpperCase();
  const levelColor = LEVEL_COLORS[levelCode] ?? "#6B7280";

  const { data: levels = [], refetch: refetchLevels } = useGetGrammarLevelsQuery();
  const levelData = useMemo(() => levels.find((l) => l.code === levelCode), [levels, levelCode]);

  const {
    data: categories = [],
    isLoading,
    error,
    refetch: refetchCategories,
  } = useGetLevelCategoriesQuery({ levelId: levelData?.id ?? "" }, { skip: !levelData?.id });

  const allRefetches = [refetchLevels, refetchCategories];
  useRefetchOnFocus(allRefetches);
  const { refreshing, onRefresh } = useRefreshControl(allRefetches);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || categories.length === 0) return;

    const firstInProgress = categories.find((c) => c.in_progress_topics > 0);
    const targetId = firstInProgress?.id || categories[0]?.id;

    if (targetId) {
      setExpandedCategories(new Set([targetId]));
      setInitialized(true);
    }
  }, [categories, initialized]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }, []);

  const totalTopics = categories.reduce((sum, c) => sum + c.total_topics, 0);
  const completedTopics = categories.reduce((sum, c) => sum + c.completed_topics, 0);
  const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">{t("common.loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-destructive text-center">{t("grammarPage.noCategoriesTitle")}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="bg-card rounded-2xl p-5 mb-5">
        <View className="flex-row items-center gap-3 mb-3">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{
              backgroundColor: `${levelColor}15`,
              borderWidth: 1,
              borderColor: `${levelColor}30`,
            }}
          >
            <Text className="text-lg font-bold" style={{ color: levelColor }}>
              {levelCode}
            </Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-foreground">
              {levelData?.name ?? levelCode}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {categories.length} categories · {totalTopics} topics
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-xs text-muted-foreground uppercase tracking-wider">
            Overall Progress
          </Text>
          <Text className="text-xs font-semibold" style={{ color: levelColor }}>
            {overallPct}%
          </Text>
        </View>
        <View
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? "#27272A" : "#E5E7EB" }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${overallPct}%`,
              backgroundColor: levelColor,
            }}
          />
        </View>
      </View>

      <View className="gap-2.5">
        {categories.map((category, index) => {
          const catColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          const isOpen = expandedCategories.has(category.id);

          return (
            <View key={category.id} className="overflow-hidden">
              <Pressable
                className="bg-card overflow-hidden active:opacity-90"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? "#27272A" : "#E7E5E4",
                  borderRadius: isOpen ? 12 : 12,
                  borderBottomLeftRadius: isOpen ? 0 : 12,
                  borderBottomRightRadius: isOpen ? 0 : 12,
                }}
                onPress={() => toggleCategory(category.id)}
              >
                <View style={{ height: 3, backgroundColor: catColor }} />
                <View className="flex-row items-center gap-3 px-4 py-3.5">
                  <View
                    className="w-9 h-9 rounded-lg items-center justify-center"
                    style={{ backgroundColor: `${catColor}15` }}
                  >
                    <BookOpen size={18} color={catColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">{category.name}</Text>
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {category.description}
                    </Text>
                  </View>
                  <View className="items-end mr-2">
                    <Text className="text-sm font-semibold" style={{ color: catColor }}>
                      {category.completed_topics}/{category.total_topics}
                    </Text>
                    <Text className="text-[10px] text-muted-foreground uppercase">completed</Text>
                  </View>
                  <ChevronDown
                    size={16}
                    color={isDark ? "#52525B" : "#A1A1AA"}
                    style={{
                      transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                    }}
                  />
                </View>
              </Pressable>

              {isOpen && (
                <View
                  className="bg-card"
                  style={{
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderColor: isDark ? "#27272A" : "#E7E5E4",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                >
                  <CategoryTopics categoryId={category.id} levelCode={rawLevel ?? ""} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {categories.length === 0 && (
        <View className="py-12 items-center">
          <BookOpen size={48} color={isDark ? "#52525B" : "#A1A1AA"} opacity={0.4} />
          <Text className="text-lg font-semibold text-foreground mt-4 mb-2">
            {t("grammarPage.noCategoriesTitle")}
          </Text>
          <Text className="text-sm text-muted-foreground text-center mb-4">
            {t("grammarPage.noCategoriesDesc")}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
