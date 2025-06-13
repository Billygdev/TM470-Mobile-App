import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, Surface, Text, useTheme } from 'react-native-paper';

export default function ExploreScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Surface style={styles.section}>
        <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
          Explore
        </Text>
        <Text variant="bodyMedium" style={[styles.paragraph, { color: colors.onBackground }]}>
          This app includes example code to help you get started.
        </Text>
      </Surface>

      <Divider />

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          File-based Routing
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onBackground }}>
          This app has two screens: <Text style={styles.bold}>index.tsx</Text> and{' '}
          <Text style={styles.bold}>explore.tsx</Text>. The layout file in{' '}
          <Text style={styles.bold}>_layout.tsx</Text> sets up the tab navigator.
        </Text>
      </Surface>

      <Divider />

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Platform Support
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onBackground }}>
          You can open this project on Android, iOS, and web. To open the web version, press{' '}
          <Text style={styles.bold}>w</Text> in the terminal.
        </Text>
      </Surface>

      <Divider />

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Images
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onBackground }}>
          Use <Text style={styles.bold}>@2x</Text> and <Text style={styles.bold}>@3x</Text> suffixes for better image scaling.
        </Text>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ height: 100, width: 100, alignSelf: 'center', marginTop: 12 }}
        />
      </Surface>

      <Divider />

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Custom Fonts
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onBackground }}>
          Open <Text style={styles.bold}>app/_layout.tsx</Text> to see how to load custom fonts such as{' '}
          <Text style={{ fontFamily: 'SpaceMono', color: colors.onBackground }}>this one</Text>.
        </Text>
      </Surface>

      <Divider />

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Theme Support
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onBackground }}>
          This app uses light and dark themes with a custom toggle system powered by React Native Paper.
        </Text>
      </Surface>

      <Divider />

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Animations
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onBackground }}>
          Animations can be created with libraries like{' '}
          <Text style={styles.bold}>react-native-reanimated</Text>.
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
    fontWeight: '600',
  },
  subtitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  paragraph: {
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
});
