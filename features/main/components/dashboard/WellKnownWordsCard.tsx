import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';

import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import GlassCard from './GlassCard';

interface WellKnownWordsCardProps {
  wellKnown: number;
  total: number;
}

export default function WellKnownWordsCard({
  wellKnown,
  total,
}: WellKnownWordsCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const pct = total > 0 ? Math.round((wellKnown / total) * 100) : 0;

  const barBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const labelColor = isDark ? 'rgba(250,250,250,0.3)' : 'rgba(0,0,0,0.3)';
  const pctColor = isDark ? 'rgba(250,250,250,0.3)' : '#a1a1aa';

  return (
    <GlassCard accentColors={['#6ee7b7', '#10b981']} style={{ flex: 1 }}>
      <View className="items-center justify-center p-4">
        <View className="flex-row items-baseline">
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 28,
              fontWeight: '700',
              color: '#6ee7b7',
            }}
          >
            {wellKnown.toLocaleString()}
          </Text>
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 16,
              fontWeight: '300',
              color: isDark ? 'rgba(250,250,250,0.25)' : '#52525b',
              marginHorizontal: 2,
            }}
          >
            /
          </Text>
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: '500',
              color: isDark ? 'rgba(250,250,250,0.35)' : '#71717a',
            }}
          >
            {total.toLocaleString()}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: 8,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: labelColor,
            marginTop: 3,
          }}
        >
          Well Known Words
        </Text>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: barBg, marginTop: 10 },
          ]}
          className="w-full"
        >
          <LinearGradient
            colors={['#6ee7b7', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              { width: pct > 0 ? `${Math.max(2, pct)}%` : '0%' },
            ]}
          />
        </View>

        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            color: pctColor,
            marginTop: 4,
          }}
        >
          {pct}%
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/training')}
        style={styles.playButton}
        accessibilityLabel="Start training"
      >
        <LinearGradient
          colors={['#10b981', '#6ee7b7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playGradient}
        >
          <Play
            size={12}
            color="#FFFFFF"
            fill="#FFFFFF"
            style={{ marginLeft: 1 }}
          />
        </LinearGradient>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 4,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
  playButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    zIndex: 2,
    shadowColor: 'rgba(110,231,183,0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  playGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
