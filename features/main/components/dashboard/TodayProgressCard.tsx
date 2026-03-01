import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import GlassCard from './GlassCard';

interface TodayProgressCardProps {
  points: number;
  exercises: number;
  activeTimeMs: number;
  wordsReviewed: number;
}

const MAX_POINTS = 200;

const MILESTONES = [
  { value: 130, label: 'Daily' },
  { value: 160, label: 'Great' },
  { value: 185, label: 'Excellent' },
] as const;

function formatTime(ms: number): string {
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function TodayProgressCard({
  points,
  exercises,
  activeTimeMs,
  wordsReviewed,
}: TodayProgressCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const clamped = Math.min(points, MAX_POINTS);
  const pct = (clamped / MAX_POINTS) * 100;

  const labelColor = isDark ? '#52525b' : '#a1a1aa';
  const sublabelColor = isDark ? 'rgba(250,250,250,0.3)' : 'rgba(0,0,0,0.3)';
  const textColor = isDark ? '#fafafa' : '#111827';
  const separatorColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const barBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  return (
    <GlassCard
      accentColors={[
        'rgba(110,231,183,0.4)',
        'rgba(245,158,11,0.3)',
        'transparent',
      ]}
    >
      <View className="p-4">
        <View className="flex-row items-baseline justify-between mb-3">
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              color: labelColor,
            }}
          >
            Today&apos;s Progress
          </Text>
          <View className="flex-row items-baseline gap-1">
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 22,
                fontWeight: '700',
                color: textColor,
              }}
            >
              {points}
            </Text>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: labelColor,
              }}
            >
              pts
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: barBg, height: 6 },
            ]}
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

          <View className="flex-row justify-between mt-1.5">
            {MILESTONES.map(ms => {
              const reached = clamped >= ms.value;
              return (
                <View key={ms.label} className="items-center">
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: reached
                        ? '#6ee7b7'
                        : isDark
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(0,0,0,0.08)',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 8,
                      color: reached
                        ? '#6ee7b7'
                        : isDark
                          ? 'rgba(250,250,250,0.2)'
                          : 'rgba(0,0,0,0.2)',
                      marginTop: 2,
                    }}
                  >
                    {ms.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View
          className="flex-row"
          style={{
            borderTopWidth: 1,
            borderTopColor: separatorColor,
            paddingTop: 10,
          }}
        >
          <StatCell
            label="Exercises"
            value={String(exercises)}
            color={textColor}
            labelColor={sublabelColor}
          />
          <StatCell
            label="Time"
            value={formatTime(activeTimeMs)}
            color={textColor}
            border
            separatorColor={separatorColor}
            labelColor={sublabelColor}
          />
          <StatCell
            label="Reviewed"
            value={String(wordsReviewed)}
            color="#6ee7b7"
            border
            separatorColor={separatorColor}
            labelColor={sublabelColor}
          />
        </View>
      </View>
    </GlassCard>
  );
}

function StatCell({
  label,
  value,
  color,
  border,
  separatorColor,
  labelColor,
}: {
  label: string;
  value: string;
  color: string;
  border?: boolean;
  separatorColor?: string;
  labelColor: string;
}) {
  return (
    <View
      className="flex-1 items-center"
      style={
        border
          ? { borderLeftWidth: 1, borderLeftColor: separatorColor }
          : undefined
      }
    >
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 16,
          fontWeight: '700',
          color,
          lineHeight: 20,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 7,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: labelColor,
          marginTop: 1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
});
