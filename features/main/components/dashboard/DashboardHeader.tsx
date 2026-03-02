import React, { useState, useRef, useCallback } from 'react';

import { useRouter } from 'expo-router';
import {
  User,
  LogOut,
  BarChart3,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react-native';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated as RNAnimated,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardHeaderProps {
  insetTop: number;
}

export default function DashboardHeader({ insetTop }: DashboardHeaderProps) {
  const { isDark, setPreference } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const avatarRef = useRef<View>(null);

  const textColor = isDark ? 'rgba(250,250,250,0.9)' : '#111827';
  const mutedColor = isDark ? 'rgba(250,250,250,0.45)' : 'rgba(0,0,0,0.45)';
  const menuBg = isDark ? '#141416' : '#FFFFFF';
  const menuBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const separatorColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const email = user?.email ?? '';
  const initials = email
    .split('@')[0]
    .split('.')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const openMenu = useCallback(() => {
    avatarRef.current?.measureInWindow((x, y, width, height) => {
      setMenuTop(y + height + 6);
      setMenuOpen(true);
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim]);

  const closeMenu = useCallback(() => {
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  }, [fadeAnim]);

  const handleMenuItem = useCallback(
    (action: () => void) => {
      closeMenu();
      setTimeout(action, 180);
    },
    [closeMenu]
  );

  const handleSignOut = useCallback(() => {
    handleMenuItem(async () => {
      await signOut();
    });
  }, [handleMenuItem, signOut]);

  const handleThemeToggle = useCallback(() => {
    setPreference(isDark ? 'light' : 'dark');
  }, [isDark, setPreference]);

  return (
    <View style={[styles.header, { paddingTop: insetTop + 6 }]}>
      <View style={styles.headerInner}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View
            style={[
              styles.logoDot,
              {
                shadowColor: '#34d399',
                shadowOpacity: 0.7,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
          <Text style={[styles.logoText, { color: textColor }]}>
            Voc
            <Text style={styles.logoAi}>ai</Text>
            ro
          </Text>
        </View>

        {/* Right side: theme toggle + avatar dropdown */}
        <View style={styles.rightRow}>
          <Pressable
            onPress={handleThemeToggle}
            style={styles.themeBtn}
            accessibilityLabel="Toggle theme"
          >
            {isDark ? (
              <Moon size={17} color={mutedColor} />
            ) : (
              <Sun size={17} color={mutedColor} />
            )}
          </Pressable>

          <Pressable
            ref={avatarRef}
            onPress={openMenu}
            style={styles.avatarRow}
            accessibilityLabel="Open user menu"
          >
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.05)',
                  borderColor: menuBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: isDark ? 'rgba(250,250,250,0.5)' : '#78716C' },
                ]}
              >
                {initials || 'U'}
              </Text>
            </View>
            <ChevronDown size={13} color={mutedColor} />
          </Pressable>
        </View>
      </View>

      {/* Dropdown menu */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <RNAnimated.View
              style={[
                styles.menu,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-8, 0],
                      }),
                    },
                  ],
                  backgroundColor: menuBg,
                  borderColor: menuBorder,
                  top: menuTop,
                },
              ]}
            >
              <TouchableWithoutFeedback>
                <View>
                  {/* Email */}
                  <View style={styles.menuHeader}>
                    <Text style={[styles.menuLabel, { color: mutedColor }]}>
                      Signed in as
                    </Text>
                    <Text
                      style={[styles.menuEmail, { color: textColor }]}
                      numberOfLines={1}
                    >
                      {email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: separatorColor },
                    ]}
                  />

                  {/* Profile */}
                  <Pressable
                    onPress={() =>
                      handleMenuItem(() =>
                        router.push('/(tabs)/settings' as never)
                      )
                    }
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && { backgroundColor: hoverBg },
                    ]}
                  >
                    <User size={16} color={mutedColor} />
                    <Text style={[styles.menuItemText, { color: textColor }]}>
                      Profile
                    </Text>
                  </Pressable>

                  {/* Stats */}
                  <Pressable
                    onPress={() =>
                      handleMenuItem(() => router.push('/stats' as never))
                    }
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && { backgroundColor: hoverBg },
                    ]}
                  >
                    <BarChart3 size={16} color={mutedColor} />
                    <Text style={[styles.menuItemText, { color: textColor }]}>
                      Stats
                    </Text>
                  </Pressable>

                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: separatorColor },
                    ]}
                  />

                  {/* Sign Out */}
                  <Pressable
                    onPress={handleSignOut}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && { backgroundColor: hoverBg },
                    ]}
                  >
                    <LogOut size={16} color="#f87171" />
                    <Text style={[styles.menuItemText, { color: '#f87171' }]}>
                      Sign Out
                    </Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </RNAnimated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  logoAi: {
    color: '#6ee7b7',
    fontWeight: '400',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    right: 20,
    minWidth: 200,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    overflow: 'hidden',
  },
  menuHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuLabel: {
    fontSize: 11,
  },
  menuEmail: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  separator: {
    height: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
  },
});
