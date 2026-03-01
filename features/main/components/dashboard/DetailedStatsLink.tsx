import React from 'react';

import { useRouter } from 'expo-router';
import { ArrowRight, BarChart3 } from 'lucide-react-native';

import { View, Text, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import GlassCard from './GlassCard';

export default function DetailedStatsLink() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const foreground = isDark ? 'rgba(250,250,250,0.95)' : '#111827';
  const textColor = isDark ? 'rgba(250,250,250,0.55)' : 'rgba(0,0,0,0.5)';
  const iconColor = isDark ? 'rgba(250,250,250,0.3)' : '#a1a1aa';
  const iconBg = isDark ? 'rgba(110,231,183,0.08)' : 'rgba(110,231,183,0.06)';

  return (
    <GlassCard
      accentColors={[
        'rgba(110,231,183,0.3)',
        'rgba(129,140,248,0.3)',
        'rgba(168,85,247,0.2)',
      ]}
    >
      <Pressable
        onPress={() => router.push('/stats')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 12,
        }}
        accessibilityLabel="View detailed learning statistics"
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BarChart3 size={18} color="#6ee7b7" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: foreground,
            }}
          >
            Detailed Learning Stats
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: textColor,
              marginTop: 2,
            }}
          >
            Activity, streaks, progress over time
          </Text>
        </View>
        <ArrowRight size={16} color={iconColor} />
      </Pressable>
    </GlassCard>
  );
}
