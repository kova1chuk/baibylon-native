import * as React from "react";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { View } from "react-native";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
  indicatorClassName?: string;
}

function Progress({ value = 0, className, indicatorClassName }: ProgressProps) {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withTiming(Math.min(Math.max(value, 0), 100), {
      duration: 300,
    });
  }, [value, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <Animated.View
        className={cn("h-full rounded-full bg-primary", indicatorClassName)}
        style={animatedStyle}
      />
    </View>
  );
}

export { Progress };
