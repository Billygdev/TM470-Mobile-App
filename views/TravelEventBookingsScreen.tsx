import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Text, useTheme } from 'react-native-paper';
import { useTravelEventBookingsViewModel } from '../viewModels/useTravelEventBookingsViewModel';

const TravelEventBookingsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const {
    bookings,
    loading,
    error
  } = useTravelEventBookingsViewModel(id as string);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Event Bookings
      </Text>

      {loading && <ActivityIndicator size="large" />}
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}

      {!loading && (
        <>
          {/* Header row */}
          <View style={styles.tableRow}>
            <Text style={[styles.headerCell, { color: colors.onBackground }]}>Name</Text>
            <Text style={[styles.headerCell, { color: colors.onBackground }]}>Seats</Text>
            <Text style={[styles.headerCell, { color: colors.onBackground }]}>Paid</Text>
          </View>
          <Divider style={{ marginBottom: 8 }} />

          {/* Booking rows */}
          {bookings.map((booking, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cell, { color: colors.onBackground }]}>
                {booking.bookerName}
              </Text>
              <Text style={[styles.cell, { color: colors.onBackground }]}>
                {booking.seatsBooked}
              </Text>
              <Text style={[styles.cell, { color: colors.onBackground }]}>
                {booking.payed ? 'Yes' : 'No'}
              </Text>
            </View>
          ))}

          <Divider style={{ marginVertical: 16 }} />

          {/* TODO: attendance marking in user story #6 */}
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {}}
          >
            Mark Attendance
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  error: {
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default TravelEventBookingsScreen;