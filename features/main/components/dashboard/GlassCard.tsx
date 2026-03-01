import React from 'react';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { View, Platform, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  accentColors?: [string, string, ...string[]];
  className?: string;
  style?: import('react-native').ViewStyle;
}

export default function GlassCard({
  children,
  accentColors = ['rgba(110,231,183,0.5)', 'rgba(110,231,183,0.2)'],
  className,
  style,
}: GlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'rgba(17,17,19,0.65)' : 'rgba(255,255,255,0.85)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={[styles.wrapper, { borderColor }, style]}>
      <LinearGradient
        colors={accentColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />

      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      <View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
