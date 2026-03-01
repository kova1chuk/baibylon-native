import React, { useMemo } from 'react';

import Svg, {
  Path,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

import { View, Text } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import GlassCard from './GlassCard';

interface TodayProgressChartProps {
  points: number;
  exercises: number;
  activeTimeMs: number;
  wordsReviewed: number;
}

const MAX_POINTS = 200;
const K = 2.8;

const MILESTONES = [
  { value: 130, label: 'Daily' },
  { value: 160, label: 'Great' },
  { value: 185, label: 'Excellent' },
] as const;

function curveY(v: number): number {
  const norm = Math.min(v / MAX_POINTS, 1);
  return (Math.exp(norm * K) - 1) / (Math.exp(K) - 1);
}

function formatTime(ms: number): string {
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const CHART_WIDTH = 300;
const CHART_HEIGHT = 100;
const PAD = { l: 4, r: 10, t: 8, b: 18 };
const SAMPLES = 80;

export default function TodayProgressChart({
  points,
  exercises,
  activeTimeMs,
  wordsReviewed,
}: TodayProgressChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const clamped = Math.min(points, MAX_POINTS);

  const labelColor = isDark ? '#52525b' : '#a1a1aa';
  const sublabelColor = isDark ? 'rgba(250,250,250,0.3)' : 'rgba(0,0,0,0.3)';
  const textColor = isDark ? '#fafafa' : '#111827';
  const separatorColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';

  const plotW = CHART_WIDTH - PAD.l - PAD.r;
  const plotH = CHART_HEIGHT - PAD.t - PAD.b;

  const toX = (v: number) => PAD.l + (v / MAX_POINTS) * plotW;
  const toY = (cy: number) => PAD.t + plotH - cy * plotH;

  // Build the full baseline curve path
  const baselinePath = useMemo(() => {
    const parts: string[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const v = (i / SAMPLES) * MAX_POINTS;
      const x = toX(v);
      const y = toY(curveY(v));
      parts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
    }
    return parts.join(' ');
  }, []);

  // Build the filled progress path (area under curve up to current points)
  const progressPath = useMemo(() => {
    if (clamped <= 0) return '';
    const parts: string[] = [];
    const steps = Math.max(2, Math.round((clamped / MAX_POINTS) * SAMPLES));
    for (let i = 0; i <= steps; i++) {
      const v = (i / steps) * clamped;
      const x = toX(v);
      const y = toY(curveY(v));
      parts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
    }
    // Close the area: go down to baseline, back to start
    const endX = toX(clamped);
    const startX = toX(0);
    const baseY = toY(0);
    parts.push(`L${endX},${baseY}`);
    parts.push(`L${startX},${baseY}`);
    parts.push('Z');
    return parts.join(' ');
  }, [clamped]);

  // Current point position
  const curX = toX(clamped);
  const curY = toY(curveY(clamped));

  return (
    <GlassCard
      accentColors={[
        'rgba(110,231,183,0.4)',
        'rgba(245,158,11,0.3)',
        'transparent',
      ]}
    >
      <View className="p-4">
        {/* Header */}
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

        {/* Chart */}
        <View style={{ marginBottom: 12 }}>
          <Svg
            width="100%"
            height={CHART_HEIGHT}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <Defs>
              <LinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#6ee7b7" stopOpacity={0.25} />
                <Stop offset="1" stopColor="#6ee7b7" stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {/* Baseline curve (faint) */}
            <Path
              d={baselinePath}
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              strokeWidth={1.5}
            />

            {/* Milestone vertical lines and dots */}
            {MILESTONES.map(ms => {
              const mx = toX(ms.value);
              const my = toY(curveY(ms.value));
              const reached = clamped >= ms.value;
              return (
                <React.Fragment key={ms.label}>
                  <Line
                    x1={mx}
                    y1={toY(0)}
                    x2={mx}
                    y2={my}
                    stroke={
                      isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
                    }
                    strokeWidth={1}
                    strokeDasharray="4,4"
                  />
                  <Circle
                    cx={mx}
                    cy={my}
                    r={2.5}
                    fill={
                      reached
                        ? '#6ee7b7'
                        : isDark
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(0,0,0,0.08)'
                    }
                  />
                </React.Fragment>
              );
            })}

            {/* Filled progress area */}
            {clamped > 0 && <Path d={progressPath} fill="url(#fillGrad)" />}

            {/* Progress curve stroke */}
            {clamped > 0 && (
              <Path
                d={(() => {
                  const parts: string[] = [];
                  const steps = Math.max(
                    2,
                    Math.round((clamped / MAX_POINTS) * SAMPLES)
                  );
                  for (let i = 0; i <= steps; i++) {
                    const v = (i / steps) * clamped;
                    const x = toX(v);
                    const y = toY(curveY(v));
                    parts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
                  }
                  return parts.join(' ');
                })()}
                fill="none"
                stroke="#6ee7b7"
                strokeWidth={2}
              />
            )}

            {/* Current point dot */}
            {clamped > 0 && <Circle cx={curX} cy={curY} r={3} fill="#6ee7b7" />}
          </Svg>

          {/* Milestone labels below chart */}
          <View className="flex-row justify-between mt-1.5">
            {MILESTONES.map(ms => {
              const reached = clamped >= ms.value;
              return (
                <View key={ms.label} className="items-center">
                  <Text
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 8,
                      color: reached
                        ? '#6ee7b7'
                        : isDark
                          ? 'rgba(250,250,250,0.2)'
                          : 'rgba(0,0,0,0.2)',
                    }}
                  >
                    {ms.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom stat cells */}
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
