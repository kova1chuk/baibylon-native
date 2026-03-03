import React, { useCallback } from "react";

import { useRouter } from "expo-router";
import {
  BarChart3,
  ChevronRight,
  Crown,
  FileText,
  Globe,
  LogOut,
  Monitor,
  Moon,
  Shield,
  ShieldCheck,
  Sun,
  Trash2,
  RotateCcw,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Alert,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme, ThemePreference } from "@/contexts/ThemeContext";
import DashboardHeader from "@/features/main/components/dashboard/DashboardHeader";
import {
  useGetProfileQuery,
  useResetProgressMutation,
  useDeleteAccountMutation,
} from "@/features/profile/api/accountApi";

import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";

import { useColors } from "@/hooks/useColors";
import { useRefetchOnFocus } from "@/hooks/useRefetchOnFocus";
import { useRefreshControl } from "@/hooks/useRefreshControl";

const THEME_OPTIONS: {
  value: ThemePreference;
  labelKey: string;
  icon: typeof Sun;
}[] = [
  { value: "system", labelKey: "System", icon: Monitor },
  { value: "light", labelKey: "Light", icon: Sun },
  { value: "dark", labelKey: "Dark", icon: Moon },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { preference, isDark, setPreference } = useTheme();
  const colors = useColors();

  const {
    data: profile,
    isLoading: loadingProfile,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  useRefetchOnFocus([refetchProfile]);
  const { refreshing, onRefresh } = useRefreshControl([refetchProfile]);
  const [resetProgress, { isLoading: resetting }] = useResetProgressMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const userName =
    profile?.username || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const handleSignOut = useCallback(() => {
    Alert.alert(t("common.signOut"), "Are you sure you want to sign out?", [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.signOut"),
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/auth/signin");
        },
      },
    ]);
  }, [t, signOut, router]);

  const handleResetProgress = useCallback(() => {
    Alert.alert(
      "Reset Progress",
      "This will permanently delete all your learning progress. This action cannot be undone.",
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetProgress();
            Alert.alert("Done", "Your progress has been reset.");
          },
        },
      ],
    );
  }, [t, resetProgress]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. This action cannot be undone.",
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            await signOut();
            router.replace("/auth/signin");
          },
        },
      ],
    );
  }, [t, deleteAccount, signOut, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DashboardHeader insetTop={insets.top} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: tabBarHeight + insets.bottom + 16,
          paddingTop: 8,
          flexGrow: 1,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                <Text className="text-xl font-semibold text-foreground">{userName}</Text>
                <Text className="text-sm text-muted-foreground">{userEmail}</Text>
                {joinDate && (
                  <Text className="text-xs text-muted-foreground mt-0.5">Joined {joinDate}</Text>
                )}
              </View>
              {loadingProfile && <ActivityIndicator size="small" />}
            </View>

            {profile && (
              <View className="flex-row gap-4 mt-4 pt-3 border-t border-border">
                {profile.native_language && (
                  <View className="flex-row items-center gap-1.5">
                    <Globe size={14} color={colors.muted} />
                    <Text className="text-xs text-muted-foreground">
                      Native: {profile.native_language.toUpperCase()}
                    </Text>
                  </View>
                )}
                {profile.learning_language && (
                  <View className="flex-row items-center gap-1.5">
                    <Globe size={14} color={colors.muted} />
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
            onPress={() => router.push("/stats")}
          >
            <View
              className="w-9 h-9 rounded-lg items-center justify-center"
              style={{ backgroundColor: "#6EE7B715" }}
            >
              <BarChart3 size={18} color="#6EE7B7" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">{t("nav.stats")}</Text>
              <Text className="text-xs text-muted-foreground">View your learning statistics</Text>
            </View>
            <ChevronRight size={16} color={colors.muted} />
          </Pressable>

          <Pressable
            className="bg-card rounded-2xl p-4 flex-row items-center gap-3 active:opacity-80"
            onPress={() => router.push("/pricing")}
          >
            <View
              className="w-9 h-9 rounded-lg items-center justify-center"
              style={{ backgroundColor: "#F59E0B15" }}
            >
              <Crown size={18} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">{t("nav.pricing")}</Text>
              <Text className="text-xs text-muted-foreground">
                View plans and manage subscription
              </Text>
            </View>
            <ChevronRight size={16} color={colors.muted} />
          </Pressable>

          <View className="bg-card rounded-2xl p-4">
            <Text className="text-base font-semibold text-foreground mb-3">Appearance</Text>
            <View className="flex-row gap-2">
              {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
                const isActive = preference === value;
                return (
                  <Pressable
                    key={value}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                      isActive ? "bg-primary" : "bg-secondary"
                    }`}
                    onPress={() => setPreference(value)}
                  >
                    <Icon
                      size={16}
                      color={isActive ? (isDark ? "#0A0A0F" : "#FFFFFF") : colors.text}
                    />
                    <Text
                      className={`text-sm font-medium ${
                        isActive ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {labelKey}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="bg-card rounded-2xl p-4">
            <Text className="text-base font-semibold text-foreground mb-3">Legal</Text>
            <Pressable
              className="flex-row items-center gap-3 py-3 border-b border-border active:opacity-70"
              onPress={() => router.push("/privacy")}
            >
              <ShieldCheck size={18} color={colors.muted} />
              <Text className="text-sm font-medium text-foreground flex-1">Privacy Policy</Text>
              <ChevronRight size={16} color={colors.muted} />
            </Pressable>
            <Pressable
              className="flex-row items-center gap-3 py-3 active:opacity-70"
              onPress={() => router.push("/terms")}
            >
              <FileText size={18} color={colors.muted} />
              <Text className="text-sm font-medium text-foreground flex-1">Terms of Service</Text>
              <ChevronRight size={16} color={colors.muted} />
            </Pressable>
          </View>

          <View className="bg-card rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Shield size={16} color={colors.destructive} />
              <Text className="text-base font-semibold text-foreground">Danger Zone</Text>
            </View>

            <Pressable
              className="flex-row items-center gap-3 py-3 border-b border-border active:opacity-70"
              onPress={handleResetProgress}
              disabled={resetting}
            >
              <RotateCcw size={18} color="#F59E0B" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">Reset Progress</Text>
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
                <Text className="text-sm font-medium text-destructive">Delete Account</Text>
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
            <Text className="text-white font-semibold text-base">{t("common.signOut")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
