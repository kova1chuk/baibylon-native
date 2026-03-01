import React from 'react';

import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  Target,
  Play,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useTheme } from '@/contexts/ThemeContext';

import { useColors } from '@/hooks/useColors';

const TAB_CONFIG = [
  { name: 'index', labelKey: 'nav.home', Icon: LayoutDashboard },
  { name: 'ai-tutor', labelKey: 'nav.aiTutor', Icon: Sparkles },
  { name: '__play__', labelKey: '', Icon: Play },
  { name: 'grammar', labelKey: 'nav.grammar', Icon: GraduationCap },
  { name: 'training', labelKey: 'nav.training', Icon: Target },
] as const;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const activeColor = colors.tint;
  const inactiveColor = colors.icon;

  const handlePress = (routeName: string, index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (routeName === '__play__') {
      const trainingIdx = state.routes.findIndex(r => r.name === 'training');
      if (trainingIdx >= 0) {
        const route = state.routes[trainingIdx];
        navigation.navigate(route.name, route.params);
      }
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index]?.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      const route = state.routes[index];
      if (route) {
        navigation.navigate(route.name, route.params);
      }
    }
  };

  const getTabIndex = (configName: string): number => {
    return state.routes.findIndex(r => r.name === configName);
  };

  const renderTab = (config: (typeof TAB_CONFIG)[number], idx: number) => {
    if (config.name === '__play__') {
      return (
        <View key="play" className="items-center justify-center flex-1">
          <Pressable
            onPress={() => handlePress('__play__', -1)}
            className="items-center justify-center"
            style={styles.playButton}
          >
            <LinearGradient
              colors={['#10b981', '#6ee7b7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playGradient}
            >
              <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>
      );
    }

    const tabIndex = getTabIndex(config.name);
    const isActive = tabIndex >= 0 && state.index === tabIndex;
    const color = isActive ? activeColor : inactiveColor;

    return (
      <Pressable
        key={config.name}
        onPress={() => handlePress(config.name, tabIndex)}
        className="items-center justify-center flex-1 gap-0.5 py-1"
      >
        <config.Icon size={22} color={color} strokeWidth={1.8} />
        <Text
          style={{ color, fontSize: 9, fontWeight: isActive ? '600' : '400' }}
          numberOfLines={1}
        >
          {t(config.labelKey)}
        </Text>
      </Pressable>
    );
  };

  const content = (
    <View
      className="flex-row items-end"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        height: 60 + Math.max(insets.bottom, 8),
      }}
    >
      {TAB_CONFIG.map((config, idx) => renderTab(config, idx))}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={80}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? 'rgba(17, 17, 19, 0.6)'
                : 'rgba(255, 255, 255, 0.7)',
            },
          ]}
        />
        {content}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          elevation: 8,
        },
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
  },
  playButton: {
    marginTop: -28,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
