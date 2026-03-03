import { View } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function TabBarBackground() {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
