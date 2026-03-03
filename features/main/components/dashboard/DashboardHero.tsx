import React from "react";

import { useTranslation } from "react-i18next";

import { View, Text } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardHero() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const name =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  const hour = new Date().getHours();
  let greetingKey = "dashboard.goodEvening";
  if (hour < 12) greetingKey = "dashboard.goodMorning";
  else if (hour < 18) greetingKey = "dashboard.goodAfternoon";

  return (
    <View className="gap-1 px-4">
      <Text className="text-3xl font-bold text-foreground">
        {t(greetingKey)}, {name}
      </Text>
      <Text className="text-base text-muted-foreground">{t("dashboard.greeting")}</Text>
    </View>
  );
}
