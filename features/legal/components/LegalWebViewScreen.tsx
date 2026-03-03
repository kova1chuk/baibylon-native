import React, { useState } from "react";

import { WebView } from "react-native-webview";

import { View, ActivityIndicator } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { useColors } from "@/hooks/useColors";

interface LegalWebViewScreenProps {
  path: string;
}

const WEB_APP_URL = "https://vocairo.com";

export default function LegalWebViewScreen({ path }: LegalWebViewScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = useColors();
  const [loading, setLoading] = useState(true);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {loading && (
        <View className="absolute inset-0 items-center justify-center z-10">
          <ActivityIndicator size="large" />
        </View>
      )}
      <WebView
        source={{ uri: `${WEB_APP_URL}${path}` }}
        onLoadEnd={() => setLoading(false)}
        style={{
          backgroundColor: isDark ? "#0A0A0F" : "#FAF9F6",
          opacity: loading ? 0 : 1,
        }}
      />
    </View>
  );
}
