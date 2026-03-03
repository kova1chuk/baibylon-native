import React, { useState, useMemo } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowRightLeft,
  ArrowUpDown,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  HelpCircle,
  Image,
  Layers,
  ListChecks,
  Link2,
  LayoutGrid,
  Mail,
  MessageSquare,
  Mic,
  Pencil,
  Play,
  RefreshCw,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useGetUnifiedQueueQuery } from "@/entities/dictionary/api/dictionaryApi";
import {
  useGetDailyPlanQuery,
  useGetDailyProgressQuery,
  useGetStreakInfoQuery,
} from "@/entities/learning-queue/api/multiSessionApi";

import { useColors } from "@/hooks/useColors";
import { useRefetchOnFocus } from "@/hooks/useRefetchOnFocus";
import { useRefreshControl } from "@/hooks/useRefreshControl";

import type { DailyPlanSection, DailySectionKey } from "@/entities/learning-queue/api/types";
import type { ExerciseType, FocusFilter } from "@/entities/learning-queue/model/learningQueueSlice";

export interface SessionConfig {
  preferredExerciseType?: ExerciseType;
  focusFilter?: FocusFilter;
}

const EXERCISE_ID_TO_TYPE: Record<string, ExerciseType> = {
  flashcards: "flashcard",
};

function getExerciseType(exerciseId: string): ExerciseType | undefined {
  if (exerciseId in EXERCISE_ID_TO_TYPE) return EXERCISE_ID_TO_TYPE[exerciseId];
  return exerciseId as ExerciseType;
}

const SECTION_KEY_TO_FOCUS: Record<DailySectionKey, FocusFilter> = {
  review: "all",
  newWords: "words",
  grammar: "grammar",
  errors: "errors",
};

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: typeof Layers;
  href: string | null;
  color: [string, string];
  tags: string[];
}

interface ExerciseGroupData {
  title: string;
  icon: typeof BookOpen;
  iconColor: string;
  exercises: Exercise[];
}

const VOCAB_EXERCISES: Exercise[] = [
  {
    id: "flashcards",
    title: "Flashcards",
    description: "3D flip card. See word, recall translation. 4-level SRS rating.",
    icon: Layers,
    href: "/training/flashcards",
    color: ["#6ee7b7", "#10b981"],
    tags: ["words", "SRS"],
  },
  {
    id: "multiple-choice",
    title: "Multiple Choice",
    description: "Pick correct translation from 4 options. Instant feedback.",
    icon: ListChecks,
    href: "/training/multiple-choice",
    color: ["#6ee7b7", "#10b981"],
    tags: ["words", "quick"],
  },
  {
    id: "type-word",
    title: "Type the Word",
    description: "See definition + translation, type the word. Letter-by-letter check.",
    icon: Pencil,
    href: "/training/type-word",
    color: ["#10b981", "#059669"],
    tags: ["words", "spelling"],
  },
  {
    id: "match-pairs",
    title: "Match Pairs",
    description: "Connect word pairs in timed rounds. 3x7 pairs, 60s each.",
    icon: Link2,
    href: "/training/match-pairs",
    color: ["#6ee7b7", "#10b981"],
    tags: ["words", "timed"],
  },
  {
    id: "context-fill",
    title: "Context Fill",
    description: "Fill missing word in a real sentence. Word chips, source attribution.",
    icon: FileText,
    href: "/training/context-fill",
    color: ["#10b981", "#059669"],
    tags: ["words", "sentences"],
  },
  {
    id: "odd-one-out",
    title: "Odd One Out",
    description: "Which word doesn't belong? Pick the outlier from 4 words.",
    icon: CircleAlert,
    href: "/training/odd-one-out",
    color: ["#6ee7b7", "#10b981"],
    tags: ["words", "semantic"],
  },
  {
    id: "word-formation",
    title: "Word Formation",
    description: "Transform words between parts of speech. Suffix/prefix hints.",
    icon: Sparkles,
    href: "/training/word-formation",
    color: ["#34d399", "#10b981"],
    tags: ["words", "morphology"],
  },
];

const GRAMMAR_EXERCISES: Exercise[] = [
  {
    id: "rule-quiz",
    title: "Rule Quiz",
    description: "Grammar theory multiple choice. Explanation + rule box after each.",
    icon: HelpCircle,
    href: "/training/rule-quiz",
    color: ["#818cf8", "#6366f1"],
    tags: ["grammar", "theory"],
  },
  {
    id: "fill-gap",
    title: "Fill the Gap",
    description: "Type correct grammar form in sentence. Multiple accepted answers.",
    icon: GraduationCap,
    href: "/training/fill-gap",
    color: ["#818cf8", "#6366f1"],
    tags: ["grammar", "practice"],
  },
  {
    id: "error-correction",
    title: "Error Correction",
    description: "2-step: find the wrong word, then type the fix. Common mistakes.",
    icon: AlertTriangle,
    href: "/training/error-correction",
    color: ["#f87171", "#f97316"],
    tags: ["errors", "fix"],
  },
  {
    id: "sentence-transform",
    title: "Sentence Transform",
    description: "Rewrite using different structure (Active→Passive, Direct→Reported).",
    icon: RefreshCw,
    href: "/training/sentence-transform",
    color: ["#a78bfa", "#8b5cf6"],
    tags: ["grammar", "advanced"],
  },
  {
    id: "sentence-builder",
    title: "Sentence Builder",
    description: "Translate by arranging correct words in order. AI-generated.",
    icon: LayoutGrid,
    href: "/training/sentence-builder",
    color: ["#a78bfa", "#8b5cf6"],
    tags: ["grammar", "translation"],
  },
  {
    id: "cloze-test",
    title: "Cloze Test",
    description: "Fill multiple blanks in a paragraph. Tests grammar in connected text.",
    icon: FileText,
    href: "/training/cloze-test",
    color: ["#818cf8", "#6366f1"],
    tags: ["grammar", "paragraph"],
  },
];

const IRREGULAR_VERB_EXERCISES: Exercise[] = [
  {
    id: "verb-forms-drill",
    title: "Verb Forms Drill",
    description: "See V1, type V2 + V3. Three-column layout, 3-level scoring.",
    icon: GraduationCap,
    href: "/training/verb-forms-drill",
    color: ["#22d3ee", "#06b6d4"],
    tags: ["verbs", "recall"],
  },
  {
    id: "irregular-sort",
    title: "Irregular Sort",
    description: "Sort verbs: regular or irregular? Categorize, then recall forms.",
    icon: ArrowUpDown,
    href: "/training/irregular-sort",
    color: ["#22d3ee", "#06b6d4"],
    tags: ["verbs", "sorting"],
  },
];

const PHRASE_EXERCISES: Exercise[] = [
  {
    id: "phrase-builder",
    title: "Phrase Builder",
    description: "Reorder scrambled words into correct phrase/idiom. Tap-to-build.",
    icon: LayoutGrid,
    href: "/training/phrase-builder",
    color: ["#2dd4bf", "#14b8a6"],
    tags: ["phrases", "reorder"],
  },
  {
    id: "idiom-match",
    title: "Idiom Match",
    description: "Match idioms with their meanings. Tests figurative language.",
    icon: Link2,
    href: "/training/idiom-match",
    color: ["#2dd4bf", "#14b8a6"],
    tags: ["idioms", "meaning"],
  },
  {
    id: "collocations",
    title: "Collocations",
    description: '"Make a decision" not "do a decision". Pick correct pairings.',
    icon: ArrowRightLeft,
    href: null,
    color: ["#2dd4bf", "#14b8a6"],
    tags: ["collocations", "pairs"],
  },
];

const READING_EXERCISES: Exercise[] = [
  {
    id: "reading-passage",
    title: "Reading Passage",
    description: "Read short text + answer comprehension Qs (MC, True/False). Vocab tooltips.",
    icon: BookOpen,
    href: "/training/reading-passage",
    color: ["#60a5fa", "#3b82f6"],
    tags: ["reading", "comprehension"],
  },
  {
    id: "sentence-ordering",
    title: "Sentence Ordering",
    description: "Reorder shuffled sentences into coherent paragraph. Tests logic.",
    icon: GraduationCap,
    href: "/training/sentence-ordering",
    color: ["#818cf8", "#6366f1"],
    tags: ["reading", "logic"],
  },
  {
    id: "summary-writing",
    title: "Summary Writing",
    description: "Read passage, write summary in ≤X words. AI scores for accuracy.",
    icon: Pencil,
    href: "/training/summary-writing",
    color: ["#60a5fa", "#3b82f6"],
    tags: ["reading", "writing", "AI"],
  },
];

const LISTENING_EXERCISES: Exercise[] = [
  {
    id: "dictation",
    title: "Dictation",
    description: "Hear sentence, type it exactly. Replay up to 3 times. Letter check.",
    icon: Mic,
    href: "/training/dictation",
    color: ["#fb923c", "#f97316"],
    tags: ["listening", "typing"],
  },
  {
    id: "listen-choose",
    title: "Listen & Choose",
    description: "Listen to audio clip, pick correct answer from 4 options.",
    icon: Volume2,
    href: "/training/listen-choose",
    color: ["#fb923c", "#f97316"],
    tags: ["listening", "MC"],
  },
  {
    id: "minimal-pairs",
    title: "Minimal Pairs",
    description: "Hear one of two similar words (ship/sheep), pick which you heard.",
    icon: Volume2,
    href: "/training/minimal-pairs",
    color: ["#f59e0b", "#d97706"],
    tags: ["listening", "pronunciation"],
  },
];

const VISUAL_EXERCISES: Exercise[] = [
  {
    id: "picture-description",
    title: "Picture Description",
    description: "See an image, write 3-5 sentences describing it. AI-scored.",
    icon: Image,
    href: "/training/picture-description",
    color: ["#fb7185", "#e11d48"],
    tags: ["visual", "writing", "AI"],
  },
  {
    id: "visual-vocab",
    title: "Visual Vocab",
    description: "See image, pick or type the correct English word. Concrete nouns.",
    icon: Eye,
    href: "/training/visual-vocab",
    color: ["#fb7185", "#e11d48"],
    tags: ["visual", "vocab"],
  },
];

const WRITING_EXERCISES: Exercise[] = [
  {
    id: "write-sentence",
    title: "Write a Sentence",
    description: "Given word/rule, write a correct sentence. AI-scored for grammar.",
    icon: Pencil,
    href: "/training/write-sentence",
    color: ["#a855f7", "#8b5cf6"],
    tags: ["writing", "AI"],
  },
  {
    id: "email-letter",
    title: "Email / Letter",
    description: "Write structured email given a scenario. AI checks tone and grammar.",
    icon: Mail,
    href: "/training/email-letter",
    color: ["#a855f7", "#8b5cf6"],
    tags: ["writing", "formal"],
  },
  {
    id: "dialogue-completion",
    title: "Dialogue Completion",
    description: "Fill in your part of a conversation. Write natural responses.",
    icon: MessageSquare,
    href: null,
    color: ["#8b5cf6", "#7c3aed"],
    tags: ["writing", "dialogue"],
  },
];

const REVIEW_EXERCISES: Exercise[] = [
  {
    id: "spaced-review",
    title: "Spaced Review",
    description: "Mixed SRS session: flash + MC + type + fill. Interval badges.",
    icon: Clock,
    href: "/training/spaced-review",
    color: ["#f59e0b", "#f97316"],
    tags: ["SRS", "mixed"],
  },
  {
    id: "translate-sentence",
    title: "Translate Sentence",
    description: "Translate UA→EN. Vocab hints, multiple accepted answers.",
    icon: GraduationCap,
    href: "/training/translate-sentence",
    color: ["#a855f7", "#8b5cf6"],
    tags: ["translation", "production"],
  },
];

const EXERCISE_GROUPS: ExerciseGroupData[] = [
  {
    title: "Vocabulary",
    icon: BookOpen,
    iconColor: "#6ee7b7",
    exercises: VOCAB_EXERCISES,
  },
  {
    title: "Grammar",
    icon: GraduationCap,
    iconColor: "#818cf8",
    exercises: GRAMMAR_EXERCISES,
  },
  {
    title: "Irregular Verbs",
    icon: GraduationCap,
    iconColor: "#22d3ee",
    exercises: IRREGULAR_VERB_EXERCISES,
  },
  {
    title: "Phrases & Idioms",
    icon: BookOpen,
    iconColor: "#2dd4bf",
    exercises: PHRASE_EXERCISES,
  },
  {
    title: "Reading",
    icon: BookOpen,
    iconColor: "#60a5fa",
    exercises: READING_EXERCISES,
  },
  {
    title: "Listening",
    icon: Mic,
    iconColor: "#fb923c",
    exercises: LISTENING_EXERCISES,
  },
  {
    title: "Visual",
    icon: Image,
    iconColor: "#fb7185",
    exercises: VISUAL_EXERCISES,
  },
  {
    title: "Writing",
    icon: Pencil,
    iconColor: "#a855f7",
    exercises: WRITING_EXERCISES,
  },
  {
    title: "Review & Mixed",
    icon: Clock,
    iconColor: "#f59e0b",
    exercises: REVIEW_EXERCISES,
  },
];

const TYPE_COLORS: Record<string, string> = {
  word: "#6ee7b7",
  phrase: "#818cf8",
  grammar_rule: "#fbbf24",
  grammar_vocabulary: "#f59e0b",
  irregular_verb: "#fb7185",
  error_pattern: "#ef4444",
};

const SECTION_CONFIG: {
  key: DailySectionKey;
  icon: typeof Clock;
  color: string;
  gradient: [string, string];
}[] = [
  {
    key: "review",
    icon: RefreshCw,
    color: "#f59e0b",
    gradient: ["#fbbf24", "#f59e0b"],
  },
  {
    key: "newWords",
    icon: Sparkles,
    color: "#6ee7b7",
    gradient: ["#6ee7b7", "#10b981"],
  },
  {
    key: "grammar",
    icon: BookOpen,
    color: "#818cf8",
    gradient: ["#818cf8", "#6366f1"],
  },
  {
    key: "errors",
    icon: CircleAlert,
    color: "#fb7185",
    gradient: ["#fb7185", "#ef4444"],
  },
];

const SECTION_LABELS: Record<DailySectionKey, string> = {
  review: "Review",
  errors: "Errors",
  newWords: "New Words",
  grammar: "Grammar",
};

type Tab = "daily" | "exercises";

interface TrainingHubScreenProps {
  onStartSession: (config: SessionConfig) => void;
}

function ExerciseCard({
  exercise,
  isDark,
  foreground,
  muted,
  cardBg,
  cardBorder,
  onPress,
}: {
  exercise: Exercise;
  isDark: boolean;
  foreground: string;
  muted: string;
  cardBg: string;
  cardBorder: string;
  onPress: () => void;
}) {
  const [c1, c2] = exercise.color;
  const isAvailable = exercise.href !== null;
  const Icon = exercise.icon;

  return (
    <Pressable
      onPress={isAvailable ? onPress : undefined}
      style={({ pressed }) => [
        styles.exerciseCard,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          opacity: pressed && isAvailable ? 0.85 : isAvailable ? 1 : 0.5,
        },
      ]}
    >
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />
      <View style={styles.exerciseCardContent}>
        <View style={styles.exerciseCardTop}>
          <View style={[styles.exerciseIconBox, { backgroundColor: `${c1}14` }]}>
            <Icon size={22} color={c1} strokeWidth={1.5} />
          </View>
          {!isAvailable && (
            <View
              style={[
                styles.comingSoonBadge,
                {
                  backgroundColor: isDark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.08)",
                  borderColor: "rgba(245,158,11,0.15)",
                },
              ]}
            >
              <Text style={styles.comingSoonText}>COMING SOON</Text>
            </View>
          )}
        </View>
        <Text style={[styles.exerciseTitle, { color: foreground }]} numberOfLines={1}>
          {exercise.title}
        </Text>
        <Text style={[styles.exerciseDesc, { color: muted }]} numberOfLines={2}>
          {exercise.description}
        </Text>
      </View>
      <View
        style={[
          styles.exerciseFooter,
          {
            borderTopColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        <View style={styles.tagsRow}>
          {exercise.tags.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tagPill,
                {
                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  {
                    color: isDark ? "rgba(250,250,250,0.35)" : "rgba(0,0,0,0.35)",
                  },
                ]}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
        {isAvailable && <ChevronRight size={14} color={c1} />}
      </View>
    </Pressable>
  );
}

export default function TrainingHubScreen({ onStartSession }: TrainingHubScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<Tab>("daily");

  const {
    data: queueItems,
    isLoading: queueLoading,
    isError: queueError,
    refetch: refetchQueue,
  } = useGetUnifiedQueueQuery({ size: 50 });
  const { data: dailyProgress, refetch: refetchProgress } = useGetDailyProgressQuery();
  const { data: dailyPlan, refetch: refetchPlan } = useGetDailyPlanQuery();
  const { refetch: refetchStreak } = useGetStreakInfoQuery();

  const allRefetches = [refetchQueue, refetchProgress, refetchPlan, refetchStreak];
  useRefetchOnFocus(allRefetches);
  const { refreshing, onRefresh } = useRefreshControl(allRefetches);

  const foreground = isDark ? "rgba(250,250,250,0.95)" : "#111827";
  const muted = isDark ? "rgba(250,250,250,0.4)" : "rgba(0,0,0,0.4)";
  const cardBg = isDark ? "rgba(17,17,19,0.65)" : "rgba(255,255,255,0.85)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const trackBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tabBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const tabActiveBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const tabBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const queueSize = queueItems?.length ?? 0;
  const typeCounts = useMemo(
    () =>
      queueItems?.reduce(
        (acc, item) => {
          acc[item.itemType] = (acc[item.itemType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) ?? {},
    [queueItems],
  );

  const todayScore = dailyPlan?.todayScore ?? dailyProgress?.todayScore ?? 0;
  const dailyTarget = dailyPlan?.dailyTarget ?? dailyProgress?.tier1Threshold ?? 100;
  const progressPct =
    dailyTarget > 0 ? Math.min(100, Math.round((todayScore / dailyTarget) * 100)) : 0;

  const sections = dailyPlan?.sections;
  const chipData = sections
    ? [
        {
          count: Math.max(0, sections.review.total - sections.review.completedToday),
          label: "Review",
          icon: RefreshCw,
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.08)",
        },
        {
          count: Math.max(0, sections.newWords.total - sections.newWords.completedToday),
          label: "New",
          icon: Sparkles,
          color: "#6ee7b7",
          bg: "rgba(110,231,183,0.08)",
        },
        {
          count: Math.max(0, sections.grammar.total - sections.grammar.completedToday),
          label: "Grammar",
          icon: BookOpen,
          color: "#60a5fa",
          bg: "rgba(96,165,250,0.08)",
        },
        {
          count: Math.max(0, sections.errors.total - sections.errors.completedToday),
          label: "Errors",
          icon: CircleAlert,
          color: "#fb7185",
          bg: "rgba(251,113,133,0.08)",
        },
      ].filter((c) => c.count > 0)
    : [];

  const remainingExercises = dailyPlan
    ? Object.values(dailyPlan.sections).reduce(
        (sum, s) => sum + Math.max(0, s.total - s.completedToday),
        0,
      )
    : 0;

  if (queueLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDark ? "#818cf8" : "#6366f1"} />
        <Text style={{ color: muted, marginTop: 8, fontSize: 13 }}>{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: 8,
        paddingBottom: insets.bottom + 100,
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Compact Header */}
      <View style={[styles.headerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Zap size={16} color="#10b981" />
            </View>
            <Text style={[styles.headerTitle, { color: foreground }]}>
              {t("training.title") || "Training"}
            </Text>
          </View>
          <Pressable
            onPress={() => onStartSession({})}
            style={({ pressed }) => [styles.startBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={["#818cf8", "#10b981"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startBtnGradient}
            >
              <Play size={13} color="#fff" />
              <Text style={styles.startBtnText}>{t("common.startSession") || "Start Session"}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Score + progress */}
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreText, { color: foreground }]}>
            {todayScore}
            <Text style={{ color: muted, fontWeight: "400" }}>/{dailyTarget}</Text>
            <Text style={{ color: muted, fontSize: 10, fontWeight: "400" }}> pts</Text>
          </Text>
          <View style={[styles.progressTrackSmall, { backgroundColor: trackBg }]}>
            <LinearGradient
              colors={["#10b981", "#2dd4bf"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFillSmall, { width: `${Math.max(progressPct, 2)}%` }]}
            />
          </View>
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: muted,
            }}
          >
            {progressPct}%
          </Text>
        </View>

        {/* Today's plan chips */}
        {chipData.length > 0 && (
          <View style={styles.chipRow}>
            <Text style={[styles.chipLabel, { color: muted }]}>Today:</Text>
            {chipData.map((chip) => {
              const ChipIcon = chip.icon;
              return (
                <View key={chip.label} style={[styles.chip, { backgroundColor: chip.bg }]}>
                  <ChipIcon size={10} color={chip.color} />
                  <Text style={[styles.chipCount, { color: chip.color }]}>{chip.count}</Text>
                  <Text style={[styles.chipText, { color: muted }]}>{chip.label}</Text>
                </View>
              );
            })}
            {remainingExercises > 0 && (
              <Text
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: isDark ? "rgba(250,250,250,0.25)" : "rgba(0,0,0,0.25)",
                  marginLeft: 2,
                }}
              >
                · {remainingExercises} total
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabBar, { backgroundColor: tabBg, borderColor: tabBorder }]}>
        {(
          [
            {
              key: "daily" as Tab,
              label: t("training.dailyTab") || "Daily",
              icon: CalendarDays,
              count: remainingExercises,
            },
            {
              key: "exercises" as Tab,
              label: t("training.exercisesTab") || "Exercises",
              icon: GraduationCap,
              count: 0,
            },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.key;
          const TabIcon = tab.icon;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isActive ? tabActiveBg : "transparent",
                  borderWidth: isActive ? 1 : 0,
                  borderColor: isActive ? tabBorder : "transparent",
                },
              ]}
            >
              <TabIcon size={15} color={isActive ? foreground : muted} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? foreground : muted,
                }}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor: isActive
                        ? "rgba(129,140,248,0.15)"
                        : "rgba(129,140,248,0.08)",
                    },
                  ]}
                >
                  <Text style={styles.tabBadgeText}>{tab.count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Daily Tab */}
      {activeTab === "daily" && (
        <View style={{ gap: 10 }}>
          {dailyPlan &&
            SECTION_CONFIG.map(({ key, icon: Icon, color, gradient }) => {
              const section: DailyPlanSection | undefined = dailyPlan.sections[key];
              if (!section || section.total === 0) return null;
              const remaining = Math.max(0, section.total - section.completedToday);
              const isDone = remaining === 0;
              return (
                <Pressable
                  key={key}
                  onPress={() =>
                    onStartSession({
                      focusFilter: SECTION_KEY_TO_FOCUS[key],
                    })
                  }
                  style={({ pressed }) => [
                    styles.sectionCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: cardBorder,
                      opacity: pressed ? 0.85 : isDone ? 0.5 : 1,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.accentBar}
                  />
                  <View style={{ padding: 14, paddingTop: 17 }}>
                    <View style={styles.sectionRow}>
                      <View style={[styles.sectionIcon, { backgroundColor: `${color}15` }]}>
                        <Icon size={18} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: foreground,
                            }}
                          >
                            {SECTION_LABELS[key]}
                          </Text>
                          <View
                            style={{
                              backgroundColor: `${color}15`,
                              borderRadius: 100,
                              paddingHorizontal: 7,
                              paddingVertical: 2,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                fontWeight: "600",
                                color,
                              }}
                            >
                              {isDone
                                ? `${section.completedToday}/${section.total}`
                                : `${remaining}`}
                            </Text>
                          </View>
                        </View>
                        {section.previewItems.length > 0 && (
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 11,
                              color: muted,
                              marginTop: 3,
                            }}
                          >
                            {section.previewItems
                              .slice(0, 3)
                              .map((i) => i.title)
                              .join(", ")}
                          </Text>
                        )}
                      </View>
                      <ChevronRight size={14} color={muted} />
                    </View>
                  </View>
                </Pressable>
              );
            })}

          {/* Queue Composition */}
          {queueSize > 0 && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  marginTop: 4,
                },
              ]}
            >
              <View style={{ padding: 14 }}>
                <View style={styles.queueHeader}>
                  <BookOpen size={14} color={muted} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: foreground,
                    }}
                  >
                    {t("training.queueComposition") || "Queue Composition"}
                  </Text>
                </View>
                <View style={{ gap: 10 }}>
                  {Object.entries(typeCounts).map(([type, count]) => {
                    const pct = Math.round((count / queueSize) * 100);
                    const typeColor = TYPE_COLORS[type] ?? "#818cf8";
                    return (
                      <View key={type}>
                        <View style={styles.queueRow}>
                          <View style={styles.queueRowLeft}>
                            <View style={[styles.queueDot, { backgroundColor: typeColor }]} />
                            <Text
                              style={{
                                fontSize: 13,
                                color: foreground,
                                textTransform: "capitalize",
                              }}
                            >
                              {type.replace(/_/g, " ")}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontFamily: "monospace",
                              fontSize: 11,
                              color: muted,
                            }}
                          >
                            {count} ({pct}%)
                          </Text>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${pct}%`,
                                backgroundColor: typeColor,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* Empty / Error */}
          {(queueSize === 0 || queueError) && !queueLoading && (
            <View style={{ paddingVertical: 48, alignItems: "center" }}>
              <Zap size={48} color={muted} style={{ opacity: 0.4 }} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: foreground,
                  marginTop: 16,
                  marginBottom: 6,
                }}
              >
                {queueError
                  ? t("common.error") || "Error"
                  : t("training.allDoneTitle") || "All Done!"}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: muted,
                  textAlign: "center",
                }}
              >
                {queueError
                  ? t("common.tryAgain") || "Try again"
                  : t("training.allDoneDesc") || "No exercises remaining"}
              </Text>
              {queueError && (
                <Pressable
                  onPress={refetchQueue}
                  style={[
                    styles.retryBtn,
                    {
                      backgroundColor: isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.1)",
                    },
                  ]}
                >
                  <Text style={styles.retryBtnText}>{t("common.retry") || "Retry"}</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      {/* Exercises Tab */}
      {activeTab === "exercises" && (
        <View style={{ gap: 24 }}>
          {EXERCISE_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <View key={group.title}>
                <View style={styles.groupHeader}>
                  <View style={[styles.groupIconBox, { backgroundColor: `${group.iconColor}14` }]}>
                    <GroupIcon size={16} color={group.iconColor} strokeWidth={1.5} />
                  </View>
                  <Text style={[styles.groupTitle, { color: foreground }]}>{group.title}</Text>
                  <Text style={[styles.groupCount, { color: muted }]}>
                    {group.exercises.length} exercises
                  </Text>
                </View>
                <View style={{ gap: 10 }}>
                  {group.exercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      isDark={isDark}
                      foreground={foreground}
                      muted={muted}
                      cardBg={cardBg}
                      cardBorder={cardBorder}
                      onPress={() => {
                        if (exercise.href) {
                          router.push(exercise.href as never);
                        } else {
                          onStartSession({
                            preferredExerciseType: getExerciseType(exercise.id),
                          });
                        }
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  startBtn: {
    borderRadius: 8,
    overflow: "hidden",
  },
  startBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  scoreText: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "600",
  },
  progressTrackSmall: {
    flex: 1,
    height: 5,
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFillSmall: {
    height: "100%",
    borderRadius: 100,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  chipLabel: {
    fontSize: 10,
    marginRight: 2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chipCount: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "600",
  },
  chipText: {
    fontSize: 9,
  },
  tabBar: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBadge: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tabBadgeText: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "600",
    color: "#818cf8",
  },
  sectionCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  queueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  queueRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  queueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progressTrack: {
    height: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 100,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#818cf8",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  groupIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  groupCount: {
    marginLeft: "auto",
    fontSize: 12,
    fontWeight: "300",
  },
  exerciseCard: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  exerciseCardContent: {
    padding: 16,
    paddingTop: 19,
  },
  exerciseCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  exerciseIconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "600",
    color: "#f59e0b",
    letterSpacing: 0.5,
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  exerciseDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "300",
    minHeight: 36,
  },
  exerciseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 4,
  },
  tagPill: {
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tagText: {
    fontFamily: "monospace",
    fontSize: 9,
  },
});
