import React, { useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { StyleSheet } from 'react-native';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
        withTiming(0, { duration: 9000, easing: ease })
      ),
      -1
    );
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 9000, easing: ease }),
        withTiming(0, { duration: 9000, easing: ease })
      ),
      -1
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 11000, easing: ease }),
        withTiming(0, { duration: 11000, easing: ease })
      ),
      -1
    );
    orb2Y.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 11000, easing: ease }),
        withTiming(0, { duration: 11000, easing: ease })
      ),
      -1
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
      <AnimatedLinearGradient
        colors={['rgba(110,231,183,0.07)', 'transparent']}
        style={[styles.orb1, orb1Style]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      />
      <AnimatedLinearGradient
        colors={['rgba(129,140,248,0.06)', 'transparent']}
        style={[styles.orb2, orb2Style]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  orb1: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 288,
    height: 288,
    borderRadius: 144,
    zIndex: 0,
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    bottom: 40,
    right: -40,
    width: 256,
    height: 256,
    borderRadius: 128,
    zIndex: 0,
    pointerEvents: 'none',
  },
});
