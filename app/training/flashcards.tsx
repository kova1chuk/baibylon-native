import React, { useCallback, useMemo, useRef, useState } from "react";

import { useRouter } from "expo-router";
import { ArrowLeft, RotateCcw } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text, Pressable, ActivityIndicator, Animated } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import {
  useGetTrainingQueueQuery,
  useSubmitWordSessionStepResultMutation,
} from "@/entities/dictionary/api/dictionaryApi";

import { useColors } from "@/hooks/useColors";

import type { Word } from "@/entities/word/types";

const QUALITY_MAP = {
  again: { quality: 1, correct: false, color: "#EF4444" },
  hard: { quality: 3, correct: true, color: "#F59E0B" },
  good: { quality: 4, correct: true, color: "#3B82F6" },
  easy: { quality: 5, correct: true, color: "#10B981" },
} as const;

export default function FlashcardsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = useColors();

  const {
    data: queueData,
    isLoading,
    refetch,
  } = useGetTrainingQueueQuery({ trainingType: "flashcard", limit: 30 });
  const [submitResult] = useSubmitWordSessionStepResultMutation();

  const words = useMemo(() => queueData?.words ?? [], [queueData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [phase, setPhase] = useState<"active" | "summary">("active");
  const sessionStart = useRef(Date.now());

  // Flip animation
  const flipAnim = useRef(new Animated.Value(0)).current;
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = useCallback(() => {
    const toValue = isFlipped ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  }, [isFlipped, flipAnim]);

  const resetFlip = useCallback(() => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  }, [flipAnim]);

  const currentWord: Word | undefined = words[currentIndex];

  const handleRate = useCallback(
    async (rating: keyof typeof QUALITY_MAP) => {
      if (!currentWord) return;

      const { correct } = QUALITY_MAP[rating];

      setStats((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        total: prev.total + 1,
      }));

      // Submit result to backend
      submitResult({
        wordId: currentWord.id,
        exerciseType: "flashcard",
        correct,
      });

      // Next card or summary
      if (currentIndex + 1 < words.length) {
        resetFlip();
        setCurrentIndex((prev) => prev + 1);
      } else {
        setPhase("summary");
      }
    },
    [currentWord, currentIndex, words.length, submitResult, resetFlip],
  );

  const handleRestart = useCallback(() => {
    refetch();
    setCurrentIndex(0);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setPhase("active");
    resetFlip();
    sessionStart.current = Date.now();
  }, [refetch, resetFlip]);

  const foreground = isDark ? "#FAFAF9" : "#111827";
  const muted = isDark ? "rgba(250,250,250,0.45)" : "rgba(0,0,0,0.45)";
  const cardBg = isDark ? "#141416" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  // Loading
  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ color: muted, marginTop: 12, fontSize: 14 }}>{t("common.loading")}</Text>
      </View>
    );
  }

  // Empty queue
  if (words.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", color: foreground, marginBottom: 8 }}>
          {t("training.allDoneTitle") || "No cards available"}
        </Text>
        <Text style={{ fontSize: 14, color: muted, textAlign: "center", marginBottom: 24 }}>
          {t("training.noItemsAvailable")}
        </Text>
        <Pressable
          style={{
            backgroundColor: "#10B981",
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>{t("common.back")}</Text>
        </Pressable>
      </View>
    );
  }

  // Summary
  if (phase === "summary") {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return (
      <View
        className="flex-1"
        style={{
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: foreground,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {t("training.sessionComplete")}
          </Text>
          <Text style={{ fontSize: 14, color: muted, textAlign: "center", marginBottom: 32 }}>
            {t("training.reviewedItems", {
              count: stats.total,
              time: `${minutes}:${String(seconds).padStart(2, "0")}`,
            })}
          </Text>

          {/* Stats cards */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: cardBorder,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "700", color: "#10B981" }}>
                {stats.correct}
              </Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>
                {t("training.correct")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: cardBorder,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "700", color: "#EF4444" }}>
                {stats.incorrect}
              </Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>
                {t("training.wrong")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: cardBorder,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "700", color: "#818CF8" }}>{accuracy}%</Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>
                {t("training.accuracy")}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <Pressable
            style={{
              backgroundColor: "#10B981",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
            }}
            onPress={handleRestart}
          >
            <RotateCcw size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              {t("training.playAgain")}
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: foreground, fontWeight: "600", fontSize: 16 }}>
              {t("common.done")}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Active flashcard
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top + 8,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }} accessibilityLabel="Back">
          <ArrowLeft size={22} color={foreground} />
        </Pressable>
        <Text style={{ fontSize: 15, fontWeight: "600", color: foreground }}>
          {currentIndex + 1} / {words.length}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 13, color: "#10B981", fontWeight: "600" }}>{stats.correct}</Text>
          <Text style={{ fontSize: 13, color: muted }}>/</Text>
          <Text style={{ fontSize: 13, color: "#EF4444", fontWeight: "600" }}>
            {stats.incorrect}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 3,
          backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          marginHorizontal: 16,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "#10B981",
            borderRadius: 2,
          }}
        />
      </View>

      {/* Flashcard */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <Pressable
          onPress={flipCard}
          style={{ flex: 1, maxHeight: 420 }}
          accessibilityLabel={isFlipped ? "Flip to front" : "Flip to back"}
        >
          {/* Front */}
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: cardBorder,
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
              backfaceVisibility: "hidden",
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
              shadowColor: "#000",
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: 36,
                fontWeight: "700",
                color: foreground,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {currentWord?.word}
            </Text>
            {currentWord?.phonetic?.text ? (
              <Text style={{ fontSize: 16, color: muted, marginBottom: 16 }}>
                {currentWord.phonetic.text}
              </Text>
            ) : null}
            <Text style={{ fontSize: 13, color: muted, marginTop: 12 }}>
              {t("learningFeed.pressSpaceToFlip") || "Tap to flip"}
            </Text>
          </Animated.View>

          {/* Back */}
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: cardBorder,
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
              backfaceVisibility: "hidden",
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
              shadowColor: "#000",
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            }}
          >
            {currentWord?.translation ? (
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "600",
                  color: foreground,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {currentWord.translation}
              </Text>
            ) : null}
            {currentWord?.definition ? (
              <Text
                style={{
                  fontSize: 15,
                  color: muted,
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                {currentWord.definition}
              </Text>
            ) : null}
          </Animated.View>
        </Pressable>
      </View>

      {/* Rating buttons - only show when flipped */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
        }}
      >
        {isFlipped ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {(
              [
                { key: "again", label: t("learningFeed.again") || "Again" },
                { key: "hard", label: t("learningFeed.hard") || "Hard" },
                { key: "good", label: t("learningFeed.good") || "Good" },
                { key: "easy", label: t("learningFeed.easy") || "Easy" },
              ] as const
            ).map(({ key, label }) => (
              <Pressable
                key={key}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: QUALITY_MAP[key].color,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
                onPress={() => handleRate(key)}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{label}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Pressable
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
            }}
            onPress={flipCard}
          >
            <Text style={{ color: foreground, fontWeight: "600", fontSize: 16 }}>
              {t("learningFeed.pressSpaceToFlip") || "Tap to reveal"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
