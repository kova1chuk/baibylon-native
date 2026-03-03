import * as React from "react";

import { ChevronDown } from "lucide-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

import { useColors } from "@/hooks/useColors";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const colors = useColors();
  const rotation = useSharedValue(defaultOpen ? 180 : 0);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    rotation.value = withTiming(isOpen ? 0 : 180, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className={cn("border-b border-border", className)}>
      <Pressable
        className="flex-row items-center justify-between py-4 active:opacity-70"
        onPress={toggleOpen}
      >
        <Text className="text-base font-medium text-foreground flex-1">{title}</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={colors.text} />
        </Animated.View>
      </Pressable>
      {isOpen && <View className="pb-4">{children}</View>}
    </View>
  );
}

export { AccordionItem };
