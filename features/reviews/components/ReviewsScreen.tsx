import React, { useCallback, useMemo, useState } from "react";

import { BookOpen, FileText, Search, Trash2, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { View, Text, FlatList, Pressable, Alert, ActivityIndicator, TextInput } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useGetReviewsQuery, useDeleteReviewMutation } from "@/entities/review/api/reviewApi";

import { useColors } from "@/hooks/useColors";
import { useRefetchOnFocus } from "@/hooks/useRefetchOnFocus";

import type { Review } from "@/entities/review/api/reviewApi";

function calculateProgress(wordsStat: Record<number, number>): number {
  let weightedSum = 0;
  let total = 0;
  for (let stage = 1; stage <= 7; stage++) {
    const count = wordsStat[stage] || 0;
    weightedSum += count * ((stage - 1) / 6);
    total += count;
  }
  return total > 0 ? Math.round((weightedSum / total) * 100) : 0;
}

function ReviewCard({
  review,
  isDark,
  onDelete,
  deleting,
}: {
  review: Review;
  isDark: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const progress = calculateProgress(review.wordsStat);
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: isDark ? "#111113" : "#FFFFFF",
        borderWidth: 1,
        borderColor: isDark ? "#27272A" : "#E7E5E4",
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: "#F59E0B15" }}
        >
          <FileText size={18} color="#F59E0B" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
            {review.title}
          </Text>
          <Text className="text-xs text-muted-foreground mt-0.5">{date}</Text>
        </View>

        <Pressable
          className="w-8 h-8 items-center justify-center rounded-lg active:opacity-70"
          onPress={() => onDelete(review.id)}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Trash2 size={16} color={isDark ? "#EF4444" : "#DC2626"} />
          )}
        </Pressable>
      </View>

      <View className="flex-row items-center gap-4 mt-3">
        <View className="flex-row items-center gap-1.5">
          <BookOpen size={12} color={isDark ? "#A1A1AA" : "#71717A"} />
          <Text className="text-xs text-muted-foreground">{review.totalWords} words</Text>
        </View>
        <Text className="text-xs text-muted-foreground">{review.uniqueWords} unique</Text>
      </View>

      <View className="mt-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Progress
          </Text>
          <Text className="text-xs font-medium text-foreground">{progress}%</Text>
        </View>
        <View
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? "#27272A" : "#E5E7EB" }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: "#F59E0B",
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default function ReviewsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetReviewsQuery({
    page: 1,
    pageSize: 50,
  });

  useRefetchOnFocus([refetch]);
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return reviews;
    const q = search.toLowerCase();
    return reviews.filter((r) => r.title.toLowerCase().includes(q));
  }, [reviews, search]);

  const totalWords = useMemo(() => reviews.reduce((sum, r) => sum + r.totalWords, 0), [reviews]);

  const handleDelete = useCallback(
    (id: string) => {
      const review = reviews.find((r) => r.id === id);
      Alert.alert(
        "Delete Review",
        `Delete "${review?.title || "this review"}"? This cannot be undone.`,
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setDeletingId(id);
              await deleteReview({ reviewId: id });
              setDeletingId(null);
            },
          },
        ],
      );
    },
    [reviews, t, deleteReview],
  );

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View
          className="flex-1 flex-row items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            backgroundColor: isDark ? "#1A1A2E" : "#F3F4F6",
          }}
        >
          <Search size={16} color={isDark ? "#A1A1AA" : "#71717A"} />
          <TextInput
            className="flex-1 text-sm text-foreground"
            placeholder="Search reviews..."
            placeholderTextColor={isDark ? "#52525B" : "#A1A1AA"}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <X size={16} color={isDark ? "#A1A1AA" : "#71717A"} />
            </Pressable>
          )}
        </View>
      </View>

      {reviews.length > 0 && (
        <View className="flex-row gap-4 px-4 pb-3">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs text-muted-foreground">{reviews.length} reviews</Text>
          </View>
          <Text className="text-xs text-muted-foreground">
            {totalWords.toLocaleString()} total words
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            isDark={isDark}
            onDelete={handleDelete}
            deleting={deletingId === item.id}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <FileText size={48} color={isDark ? "#27272A" : "#D4D4D8"} />
            <Text className="text-base font-medium text-muted-foreground mt-4">
              {search ? "No reviews match your search" : "No reviews yet"}
            </Text>
            <Text className="text-sm text-muted-foreground mt-1 text-center px-8">
              {search ? "Try a different search term" : "Upload a text to analyze your vocabulary"}
            </Text>
          </View>
        }
      />
    </View>
  );
}
