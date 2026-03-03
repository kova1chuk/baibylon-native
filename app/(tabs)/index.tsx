import React from "react";

import { View } from "react-native";

import { WelcomeScreen } from "@/features/main";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <WelcomeScreen />
    </View>
  );
}
