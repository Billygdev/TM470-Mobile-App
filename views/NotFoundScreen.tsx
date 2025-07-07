import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        This screen does not exist.
      </Text>
      <Link href="/" style={styles.link}>
        <Text variant="bodyLarge" style={{ color: colors.primary }}>
          Go to home screen!
        </Text>
      </Link>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    paddingVertical: 10,
  },
});
