import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";

import { View, Text, Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { CEFR_NAMES } from "./constants";
import GlassCard from "./GlassCard";

interface CefrLevelCardProps {
  level: string;
  skillVocabulary: number;
  skillGrammar: number;
  skillReading: number;
  skillWriting: number;
  skillListening: number;
  skillSpeaking: number;
}

const ALL_SKILLS: {
  key: keyof Omit<CefrLevelCardProps, "level">;
  label: string;
  color: string;
}[] = [
  { key: "skillVocabulary", label: "Vocabulary", color: "#6ee7b7" },
  { key: "skillGrammar", label: "Grammar", color: "#818cf8" },
  { key: "skillReading", label: "Reading", color: "#fbbf24" },
  { key: "skillWriting", label: "Writing", color: "#f472b6" },
  { key: "skillListening", label: "Listening", color: "#38bdf8" },
  { key: "skillSpeaking", label: "Speaking", color: "#a78bfa" },
];

export default function CefrLevelCard(props: CefrLevelCardProps) {
  const { level } = props;
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const visibleSkills = ALL_SKILLS.filter((s) => props[s.key] > 0);
  const activeValues = visibleSkills.map((s) => props[s.key]);
  const combined =
    activeValues.length > 0
      ? Math.round(activeValues.reduce((a, b) => a + b, 0) / activeValues.length)
      : 0;

  const letter = level.replace(/[0-9]/g, "");
  const number = level.replace(/[^0-9]/g, "");

  const labelColor = isDark ? "rgba(250,250,250,0.3)" : "rgba(0,0,0,0.3)";
  const nameColor = isDark ? "rgba(250,250,250,0.5)" : "rgba(0,0,0,0.45)";
  const barBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const separatorColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const skillLabelColor = isDark ? "rgba(250,250,250,0.3)" : "#a1a1aa";

  return (
    <GlassCard accentColors={["#818cf8", "#6366f1"]} style={{ flex: 1 }}>
      <View className="items-center justify-center p-4">
        <View className="flex-row items-baseline">
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: "800",
              color: "#818cf8",
            }}
          >
            {letter}
          </Text>
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: "600",
              color: "#818cf8",
              opacity: 0.6,
            }}
          >
            {number}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: labelColor,
            marginTop: 3,
          }}
        >
          CEFR Level
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "300",
            color: nameColor,
            marginTop: 4,
          }}
        >
          {CEFR_NAMES[level] ?? level}
        </Text>

        {visibleSkills.length > 0 && (
          <View className="w-full" style={{ marginTop: 8, gap: 5 }}>
            {visibleSkills.map((s) => (
              <View key={s.key} className="flex-row items-center" style={{ gap: 5 }}>
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: 7,
                    color: skillLabelColor,
                    width: 52,
                    textAlign: "right",
                  }}
                  numberOfLines={1}
                >
                  {s.label}
                </Text>
                <View style={[styles.skillTrack, { backgroundColor: barBg }]} className="flex-1">
                  <View
                    style={[
                      styles.skillFill,
                      {
                        width:
                          props[s.key] > 0 ? `${Math.max(2, Math.round(props[s.key]))}%` : "0%",
                        backgroundColor: s.color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: 7,
                    fontWeight: "600",
                    color: s.color,
                    width: 24,
                  }}
                >
                  {Math.round(props[s.key])}%
                </Text>
              </View>
            ))}
          </View>
        )}

        <View
          className="flex-row items-center w-full"
          style={{
            marginTop: 6,
            paddingTop: 6,
            borderTopWidth: 1,
            borderTopColor: separatorColor,
            gap: 5,
          }}
        >
          <View style={[styles.combinedTrack, { backgroundColor: barBg }]} className="flex-1">
            <LinearGradient
              colors={["#818cf8", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.combinedFill,
                {
                  width: combined > 0 ? `${Math.max(2, combined)}%` : "0%",
                },
              ]}
            />
          </View>
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: "600",
              color: "#818cf8",
            }}
          >
            {combined}%
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/grammar")}
        style={styles.playButton}
        accessibilityLabel="Start grammar training"
      >
        <LinearGradient
          colors={["#818cf8", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playGradient}
        >
          <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 1 }} />
        </LinearGradient>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  skillTrack: {
    height: 3,
    borderRadius: 100,
    overflow: "hidden",
  },
  skillFill: {
    height: "100%",
    borderRadius: 100,
  },
  combinedTrack: {
    height: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  combinedFill: {
    height: "100%",
    borderRadius: 100,
  },
  playButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    shadowColor: "rgba(129,140,248,0.15)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  playGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
