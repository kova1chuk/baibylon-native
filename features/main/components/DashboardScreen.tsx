import React from 'react';

import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, ScrollView, Pressable } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetDashboardHomeQuery } from '@/features/hub/api/dashboardApi';

import { useColors } from '@/hooks/useColors';

import AmbientOrbs from './dashboard/AmbientOrbs';
import CefrLevelCard from './dashboard/CefrLevelCard';
import DetailedStatsLink from './dashboard/DetailedStatsLink';
import GreetingCard from './dashboard/GreetingCard';
import TodayProgressChart from './dashboard/TodayProgressChart';
import WellKnownWordsCard from './dashboard/WellKnownWordsCard';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();

  const { data: dashboardHome } = useGetDashboardHomeQuery();

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.user_metadata?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    '';

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: insets.top + 8,
          flexGrow: 1,
        }}
      >
        <View
          className="relative"
          style={{ maxWidth: 540, alignSelf: 'center', width: '100%' }}
        >
          <AmbientOrbs />

          <View className="relative z-[1] px-5" style={{ gap: 8 }}>
            <View className="flex-row items-center justify-end mb-1">
              <Pressable
                onPress={() => router.push('/(tabs)/settings' as never)}
                className="p-2 active:opacity-50"
                accessibilityLabel="Settings"
              >
                <Settings size={20} color={isDark ? '#A1A1AA' : '#78716C'} />
              </Pressable>
            </View>

            <GreetingCard firstName={firstName} />

            <TodayProgressChart
              points={dashboardHome?.todayPoints ?? 0}
              exercises={dashboardHome?.todayExercises ?? 0}
              activeTimeMs={dashboardHome?.todayActiveTimeMs ?? 0}
              wordsReviewed={dashboardHome?.todayWordsReviewed ?? 0}
            />

            <View className="flex-row" style={{ gap: 8 }}>
              <View className="flex-1">
                <WellKnownWordsCard
                  wellKnown={dashboardHome?.wellKnownWords ?? 0}
                  total={dashboardHome?.totalWords ?? 0}
                />
              </View>
              <View className="flex-1">
                <CefrLevelCard
                  level={dashboardHome?.cefrLevel ?? 'A1'}
                  skillVocabulary={dashboardHome?.skillVocabulary ?? 0}
                  skillGrammar={dashboardHome?.skillGrammar ?? 0}
                  skillReading={dashboardHome?.skillReading ?? 0}
                  skillWriting={dashboardHome?.skillWriting ?? 0}
                  skillListening={dashboardHome?.skillListening ?? 0}
                  skillSpeaking={dashboardHome?.skillSpeaking ?? 0}
                />
              </View>
            </View>

            <DetailedStatsLink />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
