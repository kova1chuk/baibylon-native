import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Alert, View, Text, ScrollView, Switch, Pressable } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/signin');
        },
      },
    ]);
  };

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const userName =
    user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: tabBarHeight + insets.bottom + 16,
        paddingTop: insets.top + 16,
        flexGrow: 1,
      }}
    >
      <View className="gap-4 p-4">
        {/* Profile section */}
        <View className="gap-3 bg-card rounded-2xl p-4">
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-[60px] h-[60px] rounded-full bg-primary items-center justify-center">
              <Text className="text-2xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-foreground">
                {userName}
              </Text>
              <Text className="text-base text-muted-foreground">
                {userEmail}
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance section */}
        <View className="gap-2 bg-card rounded-2xl p-4">
          <Text className="text-xl font-semibold text-foreground mb-2">
            Appearance
          </Text>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3 flex-1">
              {isDark ? (
                <Moon size={20} color={isDark ? '#FAFAF9' : '#111827'} />
              ) : (
                <Sun size={20} color={isDark ? '#FAFAF9' : '#111827'} />
              )}
              <View className="flex-1">
                <Text className="text-lg font-medium text-foreground">
                  Dark Mode
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeChange}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Sign out button */}
        <Pressable
          className="flex-row items-center justify-center gap-2 bg-destructive rounded-xl py-4 px-6 active:opacity-80"
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold text-base">Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
