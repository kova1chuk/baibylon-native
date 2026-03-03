import * as React from "react";

import { BlurView } from "expo-blur";

import { View, Platform } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface GlassViewProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

function GlassView({ children, intensity = 50, className }: GlassViewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={intensity}
        tint={isDark ? "dark" : "light"}
        className={cn("overflow-hidden rounded-2xl border border-border/50", className)}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50",
        isDark ? "bg-card/90" : "bg-card/80",
        className,
      )}
    >
      {children}
    </View>
  );
}

export { GlassView };
