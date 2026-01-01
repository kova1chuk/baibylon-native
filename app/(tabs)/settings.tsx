import { Moon, Sun, LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Text,
  View,
  XStack,
  YStack,
  useTheme as useTamaguiTheme,
  Switch,
  ScrollView,
} from 'tamagui';

import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const tamaguiTheme = useTamaguiTheme();
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
      flex={1}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + insets.bottom + 16,
        paddingTop: insets.top + 16,
        flexGrow: 1,
      }}
    >
      <YStack gap="$4" padding="$4">
        {/* Profile Section */}
        <YStack
          gap="$3"
          backgroundColor="$background"
          padding="$4"
          borderRadius="$4"
        >
          <XStack alignItems="center" gap="$3" marginBottom="$2">
            <View
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor="$blue10"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="$8" fontWeight="bold" color="white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <YStack flex={1}>
              <Text fontSize="$6" fontWeight="600" color="$color">
                {userName}
              </Text>
              <Text fontSize="$4" color="$color" opacity={0.7}>
                {userEmail}
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Settings Section */}
        <YStack
          gap="$2"
          backgroundColor="$background"
          padding="$4"
          borderRadius="$4"
        >
          <Text fontSize="$6" fontWeight="600" color="$color" marginBottom="$2">
            Appearance
          </Text>

          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingVertical="$3"
          >
            <XStack alignItems="center" gap="$3" flex={1}>
              {isDark ? (
                <Moon size={20} color={tamaguiTheme.color?.val} />
              ) : (
                <Sun size={20} color={tamaguiTheme.color?.val} />
              )}
              <YStack flex={1}>
                <Text fontSize="$5" fontWeight="500" color="$color">
                  Dark Mode
                </Text>
                <Text fontSize="$3" color="$color" opacity={0.6}>
                  {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </YStack>
            </XStack>
            <Switch
              checked={isDark}
              onCheckedChange={handleThemeChange}
              size="$4"
            />
          </XStack>
        </YStack>

        {/* Sign Out Button */}
        <Button
          size="$5"
          backgroundColor="$red10"
          color="white"
          fontWeight="600"
          icon={LogOut}
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </YStack>
    </ScrollView>
  );
}
