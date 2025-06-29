import LogoutButton from '@/components/LogoutButton';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useHomeViewModel } from '@/viewModels/useHomeViewModel';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { colors } = useTheme();
  const {
    displayName,
    navigateToCreateEvent,
    loadingNews,
    news
  } = useHomeViewModel();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.mainTitle, { color: colors.onBackground }]}>
        Sports Travel Organizer
      </Text>

      <Text variant="titleMedium" style={[styles.subTitle, { color: colors.onBackground }]}>
        Welcome {displayName}
      </Text>

      <Text variant="bodyMedium" style={[styles.introText, { color: colors.onBackground }]}>
        This app helps you organize and manage football travel events, stay updated on news, and handle your bookings and schedules easily.
      </Text>

      <Divider style={{ marginVertical: 16 }} />

      {/* THESE ARE TEST BUTTONS AND WILL BE REPLACED AT A LATER DATE */}
      <Text variant="titleMedium" style={[styles.subTitle, { color: colors.onBackground }]}>
        Test Buttons
      </Text>

      <ThemeToggleButton />
      <LogoutButton />

      <Button
        mode="contained"
        onPress={navigateToCreateEvent}
        style={styles.createEventButton}
      >
        Create Event
      </Button>

      <Divider style={{ marginVertical: 16 }} />

      <Text variant="titleMedium" style={[styles.subTitle, { color: colors.onBackground }]}>
        News
      </Text>

      {!loadingNews && news.length > 0 && (
        <View>
          {news.map(article => (
            <View key={article.id} style={{ marginBottom: 16 }}>
              <Text variant="titleMedium">{article.title}</Text>
              <Text variant="bodySmall">{new Date(article.date.seconds * 1000).toLocaleDateString()}</Text>
              <Text variant="bodyMedium">{article.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  mainTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  introText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createEventButton: {
    marginTop: 16,
  },
});
