import React, { useState } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "react-native";

import DashboardHeader from "@/features/main/components/dashboard/DashboardHeader";
import { TrainingScreen } from "@/features/training";
import TrainingHubScreen from "@/features/training/components/TrainingHubScreen";

import { useColors } from "@/hooks/useColors";

import type { SessionConfig } from "@/features/training/components/TrainingHubScreen";

export default function TrainingTab() {
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const insets = useSafeAreaInsets();
  const colors = useColors();

  if (sessionConfig) {
    return (
      <View style={{ flex: 1 }}>
        <TrainingScreen sessionConfig={sessionConfig} onBack={() => setSessionConfig(null)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DashboardHeader insetTop={insets.top} />
      <TrainingHubScreen onStartSession={(config) => setSessionConfig(config)} />
    </View>
  );
}
