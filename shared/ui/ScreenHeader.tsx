import React from "react";

import { Text, View } from "react-native";

interface ScreenHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function ScreenHeader({ icon, title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center gap-2 mb-5">
      {icon}
      <View>
        <Text className="text-xl font-bold text-foreground">{title}</Text>
        {subtitle && <Text className="text-xs text-muted-foreground mt-0.5">{subtitle}</Text>}
      </View>
    </View>
  );
}
