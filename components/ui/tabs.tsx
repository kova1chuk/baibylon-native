import * as React from "react";

import { View, Pressable, Text } from "react-native";

import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <View className={cn("flex-row bg-muted rounded-xl p-1", className)}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg items-center justify-center",
              isActive && "bg-background shadow-sm",
            )}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              className={cn(
                "text-sm font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { Tabs };
export type { Tab, TabsProps };
