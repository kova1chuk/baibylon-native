import React from "react";

import { Lightbulb } from "lucide-react-native";

import { Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { getDailyContent } from "./constants";
import GlassCard from "./GlassCard";

interface GreetingCardProps {
  firstName: string;
}

export default function GreetingCard({ firstName }: GreetingCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { quote, tip } = getDailyContent();

  const foreground = isDark ? "rgba(250,250,250,0.95)" : "#111827";
  const subtleText = isDark ? "rgba(250,250,250,0.55)" : "rgba(0,0,0,0.5)";
  const quoteColor = isDark ? "rgba(250,250,250,0.4)" : "rgba(0,0,0,0.35)";
  const tipBg = isDark ? "rgba(110,231,183,0.04)" : "rgba(110,231,183,0.06)";
  const tipBorder = isDark ? "rgba(110,231,183,0.06)" : "rgba(110,231,183,0.12)";

  return (
    <GlassCard accentColors={["rgba(110,231,183,0.4)", "rgba(129,140,248,0.3)", "transparent"]}>
      <View className="p-4">
        <Text style={{ color: subtleText, fontSize: 14, fontWeight: "300" }}>
          Hi, <Text style={{ fontWeight: "600", color: foreground }}>{firstName}</Text>
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            fontStyle: "italic",
            lineHeight: 26,
            marginTop: 2,
            color: foreground,
          }}
        >
          Keep building your English
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "300",
            fontStyle: "italic",
            color: quoteColor,
            lineHeight: 21,
            marginTop: 6,
          }}
        >
          {"\u275D"} {quote} {"\u275E"}
        </Text>

        <View
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            backgroundColor: tipBg,
            borderWidth: 1,
            borderColor: tipBorder,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <Lightbulb size={16} color="#6ee7b7" style={{ opacity: 0.6, marginTop: 1 }} />
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              color: subtleText,
              lineHeight: 17,
            }}
          >
            {tip}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}
