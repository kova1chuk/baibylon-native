import React from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "react-native";

import { GrammarLevelsScreen } from "@/features/grammar";
import DashboardHeader from "@/features/main/components/dashboard/DashboardHeader";

import { useColors } from "@/hooks/useColors";

export default function GrammarTab() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DashboardHeader insetTop={insets.top} />
      <GrammarLevelsScreen />
    </View>
  );
}
