import { TravelEventCard } from '@/components/TravelEventCard';
import { useTravelEventsSearchViewModel } from '@/viewModels/useTravelEventsSearchViewModel';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Searchbar, Text, useTheme } from 'react-native-paper';

export default function TravelEventsSearchScreen() {
  const { colors } = useTheme();
  const {
    events,
    loading,
    searchQuery,
    setSearchQuery,
    handleEventPress,
  } = useTravelEventsSearchViewModel();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Search Events
      </Text>

      <Searchbar
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : events.length === 0 ? (
        <Text style={[styles.emptyMessage, { color: colors.onBackground }]}>
          No travel events found.
        </Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id!}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TravelEventCard
              title={item.title}
              destination={item.destination}
              pickupLocation={item.pickupLocation}
              pickupDate={item.pickupDate}
              pickupTime={item.pickupTime}
              price={item.price}
              onPress={() => handleEventPress(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  search: {
    marginBottom: 16,
  },
  loader: {
    marginTop: 32,
  },
  list: {
    paddingBottom: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
});