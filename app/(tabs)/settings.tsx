import React, { useCallback } from 'react';

import { useRouter } from 'expo-router';
import {
  BarChart3,
  ChevronRight,
  Crown,
  FileText,
  Globe,
  LogOut,
  Moon,
  Shield,
  ShieldCheck,
  Sun,
  Trash2,
  RotateCcw,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Alert,
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetProfileQuery,
  useResetProgressMutation,
  useDeleteAccountMutation,
} from '@/features/profile/api/accountApi';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const { data: profile, isLoading: loadingProfile } = useGetProfileQuery();
  const [resetProgress, { isLoading: resetting }] = useResetProgressMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const userName =
    profile?.username ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';
  const userEmail = user?.email || '';
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const handleSignOut = useCallback(() => {
    Alert.alert(t('common.signOut'), 'Are you sure you want to sign out?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.signOut'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/signin');
        },
      },
    ]);
  }, [t, signOut, router]);

  const handleResetProgress = useCallback(() => {
    Alert.alert(
      'Reset Progress',
      'This will permanently delete all your learning progress. This action cannot be undone.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Done', 'Your progress has been reset.');
          },
        },
      ]
    );
  }, [t, resetProgress]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            await signOut();
            router.replace('/auth/signin');
          },
        },
      ]
    );
  }, [t, deleteAccount, signOut, router]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingBottom: tabBarHeight + insets.bottom + 16,
        paddingTop: insets.top + 16,
        flexGrow: 1,
      }}
    >
      <View className="gap-4 p-4">
        <View className="bg-card rounded-2xl p-4">
          <View className="flex-row items-center gap-3">
            <View className="w-[60px] h-[60px] rounded-full bg-primary items-center justify-center">
              <Text className="text-2xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-foreground">
                {userName}
              </Text>
              <Text className="text-sm text-muted-foreground">{userEmail}</Text>
              {joinDate && (
                <Text className="text-xs text-muted-foreground mt-0.5">
                  Joined {joinDate}
                </Text>
              )}
            </View>
            {loadingProfile && <ActivityIndicator size="small" />}
          </View>

          {profile && (
            <View className="flex-row gap-4 mt-4 pt-3 border-t border-border">
              {profile.native_language && (
                <View className="flex-row items-center gap-1.5">
                  <Globe size={14} color={isDark ? '#52525B' : '#A1A1AA'} />
                  <Text className="text-xs text-muted-foreground">
                    Native: {profile.native_language.toUpperCase()}
                  </Text>
                </View>
              )}
              {profile.learning_language && (
                <View className="flex-row items-center gap-1.5">
                  <Globe size={14} color={isDark ? '#52525B' : '#A1A1AA'} />
                  <Text className="text-xs text-muted-foreground">
                    Learning: {profile.learning_language.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Pressable
          className="bg-card rounded-2xl p-4 flex-row items-center gap-3 active:opacity-80"
          onPress={() => router.push('/stats')}
        >
          <View
            className="w-9 h-9 rounded-lg items-center justify-center"
            style={{ backgroundColor: '#6EE7B715' }}
          >
            <BarChart3 size={18} color="#6EE7B7" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">
              {t('nav.stats')}
            </Text>
            <Text className="text-xs text-muted-foreground">
              View your learning statistics
            </Text>
          </View>
          <ChevronRight size={16} color={isDark ? '#52525B' : '#A1A1AA'} />
        </Pressable>

        <Pressable
          className="bg-card rounded-2xl p-4 flex-row items-center gap-3 active:opacity-80"
          onPress={() => router.push('/pricing')}
        >
          <View
            className="w-9 h-9 rounded-lg items-center justify-center"
            style={{ backgroundColor: '#F59E0B15' }}
          >
            <Crown size={18} color="#F59E0B" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">
              {t('nav.pricing')}
            </Text>
            <Text className="text-xs text-muted-foreground">
              View plans and manage subscription
            </Text>
          </View>
          <ChevronRight size={16} color={isDark ? '#52525B' : '#A1A1AA'} />
        </Pressable>

        <View className="bg-card rounded-2xl p-4">
          <Text className="text-base font-semibold text-foreground mb-3">
            Appearance
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              {isDark ? (
                <Moon size={20} color={isDark ? '#FAFAF9' : '#111827'} />
              ) : (
                <Sun size={20} color={isDark ? '#FAFAF9' : '#111827'} />
              )}
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">
                  Dark Mode
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={v => setTheme(v ? 'dark' : 'light')}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View className="bg-card rounded-2xl p-4">
          <Text className="text-base font-semibold text-foreground mb-3">
            Legal
          </Text>
          <Pressable
            className="flex-row items-center gap-3 py-3 active:opacity-70"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#27272A' : '#F3F4F6',
            }}
            onPress={() => router.push('/privacy')}
          >
            <ShieldCheck size={18} color={isDark ? '#A1A1AA' : '#71717A'} />
            <Text className="text-sm font-medium text-foreground flex-1">
              Privacy Policy
            </Text>
            <ChevronRight size={16} color={isDark ? '#52525B' : '#A1A1AA'} />
          </Pressable>
          <Pressable
            className="flex-row items-center gap-3 py-3 active:opacity-70"
            onPress={() => router.push('/terms')}
          >
            <FileText size={18} color={isDark ? '#A1A1AA' : '#71717A'} />
            <Text className="text-sm font-medium text-foreground flex-1">
              Terms of Service
            </Text>
            <ChevronRight size={16} color={isDark ? '#52525B' : '#A1A1AA'} />
          </Pressable>
        </View>

        <View className="bg-card rounded-2xl p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Shield size={16} color={isDark ? '#EF4444' : '#DC2626'} />
            <Text className="text-base font-semibold text-foreground">
              Danger Zone
            </Text>
          </View>

          <Pressable
            className="flex-row items-center gap-3 py-3 active:opacity-70"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#27272A' : '#F3F4F6',
            }}
            onPress={handleResetProgress}
            disabled={resetting}
          >
            <RotateCcw size={18} color={isDark ? '#F59E0B' : '#D97706'} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">
                Reset Progress
              </Text>
              <Text className="text-xs text-muted-foreground">
                Clear all learning data and start fresh
              </Text>
            </View>
            {resetting && <ActivityIndicator size="small" />}
          </Pressable>

          <Pressable
            className="flex-row items-center gap-3 py-3 active:opacity-70"
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            <Trash2 size={18} color="#EF4444" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-destructive">
                Delete Account
              </Text>
              <Text className="text-xs text-muted-foreground">
                Permanently delete your account and data
              </Text>
            </View>
            {deleting && <ActivityIndicator size="small" />}
          </Pressable>
        </View>

        <Pressable
          className="flex-row items-center justify-center gap-2 bg-destructive rounded-xl py-4 px-6 active:opacity-80"
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold text-base">
            {t('common.signOut')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
