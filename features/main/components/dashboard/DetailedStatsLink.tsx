import React from 'react';

import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

import { Text, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import GlassCard from './GlassCard';

export default function DetailedStatsLink() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const textColor = isDark ? 'rgba(250,250,250,0.7)' : 'rgba(0,0,0,0.6)';
  const iconColor = isDark ? '#52525b' : '#a1a1aa';

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
        className="flex-row items-center justify-between px-4 py-3 active:opacity-70"
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '500',
            color: textColor,
          }}
        >
          Detailed Learning Stats
        </Text>
        <ArrowRight size={18} color={iconColor} />
      </Pressable>
    </GlassCard>
  );
}
