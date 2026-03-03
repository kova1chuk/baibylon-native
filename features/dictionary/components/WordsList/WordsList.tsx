import React, { useCallback } from "react";

import { Volume2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import type { Word } from "@/entities/word/types";
import type { WordStatus } from "@/shared/types";

interface WordsListProps {
  words: Word[];
  totalWords: number;
  hasMore: boolean;
  isFetching: boolean;
  onStatusFilterChange?: (status: WordStatus | "all") => void;
  selectedStatus?: WordStatus | "all";
  onLoadMore?: () => void;
  contentPaddingBottom?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const STATUS_COLORS: Record<WordStatus | "all", string> = {
  "1": "#6B7280",
  "2": "#EF4444",
  "3": "#F97316",
  "4": "#F59E0B",
  "5": "#3B82F6",
  "6": "#10B981",
  "7": "#8B5CF6",
  all: "#6B7280",
};

const STATUS_I18N_KEYS: Record<WordStatus, string> = {
  1: "wordStatus.notStarted",
  2: "wordStatus.introduced",
  3: "wordStatus.encountered",
  4: "wordStatus.learning",
  5: "wordStatus.familiar",
  6: "wordStatus.confident",
  7: "wordStatus.mastered",
};

export default function WordsList({
  words,
  hasMore,
  isFetching,
  onStatusFilterChange,
  selectedStatus = "all",
  onLoadMore,
  contentPaddingBottom = 0,
  refreshing = false,
  onRefresh,
}: WordsListProps) {
  const { t } = useTranslation();

  const statusFilters: { key: WordStatus | "all"; labelKey: string }[] = [
    { key: "all", labelKey: "feed.all" },
    { key: 1, labelKey: "wordStatus.notStarted" },
    { key: 2, labelKey: "wordStatus.introduced" },
    { key: 3, labelKey: "wordStatus.encountered" },
    { key: 4, labelKey: "wordStatus.learning" },
    { key: 5, labelKey: "wordStatus.familiar" },
    { key: 6, labelKey: "wordStatus.confident" },
    { key: 7, labelKey: "wordStatus.mastered" },
  ];

  const renderStatusFilter = useCallback(
    ({ item }: { item: { key: WordStatus | "all"; labelKey: string } }) => {
      const isSelected = selectedStatus === item.key;
      const color = STATUS_COLORS[item.key];

      return (
        <Pressable
          className="rounded-lg px-4 py-2 min-w-[80px] items-center active:opacity-70"
          style={{
            borderWidth: 1,
            borderColor: isSelected ? color : "#D1D5DB",
            backgroundColor: isSelected ? color : "transparent",
          }}
          onPress={() => onStatusFilterChange?.(item.key)}
        >
          <Text
            className="font-medium text-sm"
            style={{ color: isSelected ? "#FFFFFF" : "#6B7280" }}
          >
            {t(item.labelKey)}
          </Text>
        </Pressable>
      );
    },
    [selectedStatus, onStatusFilterChange, t],
  );

  const renderWordItem = useCallback(
    ({ item }: { item: Word }) => {
      const color = STATUS_COLORS[item.status];
      const label = t(STATUS_I18N_KEYS[item.status]);

      return (
        <View className="mb-3">
          <View
            className="p-4 rounded-xl bg-card shadow-sm"
            style={{ borderLeftWidth: 4, borderLeftColor: color }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-xl font-semibold text-foreground">{item.word}</Text>
                {item.phonetic?.text && (
                  <View className="flex-row items-center gap-1">
                    <Volume2 size={12} color="#999" />
                    <Text className="text-xs text-muted-foreground">{item.phonetic.text}</Text>
                  </View>
                )}
              </View>
              <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: color }}>
                <Text className="text-xs font-medium text-white">{label}</Text>
              </View>
            </View>

            {item.translation && (
              <Text className="text-base mb-1 text-foreground opacity-80">{item.translation}</Text>
            )}

            {item.definition && (
              <Text className="text-sm text-muted-foreground italic" numberOfLines={2}>
                {item.definition}
              </Text>
            )}
          </View>
        </View>
      );
    },
    [t],
  );

  const renderFooter = useCallback(() => {
    if (!isFetching || !hasMore) return null;
    return (
      <View className="items-center py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  }, [isFetching, hasMore]);

  return (
    <View className="flex-1">
      <View className="py-3 border-b border-border">
        <FlatList
          data={statusFilters}
          renderItem={renderStatusFilter}
          keyExtractor={(item) => String(item.key)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: contentPaddingBottom,
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
        }
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-base text-muted-foreground">{t("dictionary.noItemsFound")}</Text>
          </View>
        }
      />
    </View>
  );
}
