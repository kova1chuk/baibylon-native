import React, { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Circle as SvgCircle } from "react-native-svg";

import { StyleSheet, View } from "react-native";

const AnimatedView = Animated.createAnimatedComponent(View);

function RadialOrb({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id={`grad-${color}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="0.7" stopColor={color} stopOpacity={opacity * 0.3} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <SvgCircle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#grad-${color})`} />
    </Svg>
  );
}

export default function AmbientOrbs() {
  const orb1X = useSharedValue(0);
  const orb1Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb2Y = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);

    orb1X.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 9000, easing: ease }),
        withTiming(0, { duration: 9000, easing: ease }),
      ),
      -1,
    );
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 9000, easing: ease }),
        withTiming(0, { duration: 9000, easing: ease }),
      ),
      -1,
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 11000, easing: ease }),
        withTiming(0, { duration: 11000, easing: ease }),
      ),
      -1,
    );
    orb2Y.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 11000, easing: ease }),
        withTiming(0, { duration: 11000, easing: ease }),
      ),
      -1,
    );
  }, [orb1X, orb1Y, orb2X, orb2Y]);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb1X.value }, { translateY: orb1Y.value }],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb2X.value }, { translateY: orb2Y.value }],
  }));

  return (
    <>
      <AnimatedView style={[styles.orb1, orb1Style]}>
        <RadialOrb size={288} color="#6ee7b7" opacity={0.12} />
      </AnimatedView>
      <AnimatedView style={[styles.orb2, orb2Style]}>
        <RadialOrb size={256} color="#818cf8" opacity={0.1} />
      </AnimatedView>
    </>
  );
}

const styles = StyleSheet.create({
  orb1: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 288,
    height: 288,
    zIndex: 0,
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    bottom: 40,
    right: -40,
    width: 256,
    height: 256,
    zIndex: 0,
    pointerEvents: "none",
  },
});
