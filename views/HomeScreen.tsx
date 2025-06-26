import FirestoreTestButton from '@/components/FirestoreTestButton';
import LogoutButton from '@/components/LogoutButton';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const displayName = user?.displayName ?? 'User';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Welcome to the TM470 App - {displayName}
      </Text>
      <Text variant="bodyMedium" style={[styles.paragraph, { color: colors.onBackground }]}>
        This is your home screen. From here, you can navigate through the app,
        toggle between light and dark mode, and explore more features.
      </Text>
      <ThemeToggleButton />
      <FirestoreTestButton />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    fontWeight: '600',
  },
  paragraph: {
    marginBottom: 24,
    lineHeight: 22,
  },
});
