import { PaymentModal } from '@/components/PaymentModal';
import { useTravelEventDetailsViewModel } from '@/viewModels/useTravelEventDetailsViewModel';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function TravelEventDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    event,
    seatsRequired,
    setSeatsRequired,
    handleJoinEvent,
    handlePaymentSubmit,
    showPaymentModal,
    handlePaymentCancel,
    error,
    loading,
    handleViewEventBookings,
  } = useTravelEventDetailsViewModel();

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.onBackground }}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Travel Event
      </Text>

      <View style={styles.sectionHeaderWithIcon}>
        <Text variant="titleMedium" style={[styles.sectionHeader, { color: colors.onBackground }]}>
          Details
        </Text>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => router.push({
            pathname: '/edit-event/[eventId]',
            params: { eventId: event.id! },
          })}
          accessibilityLabel="Edit Event"
        />
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Event Title:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>{event.title}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Destination:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>{event.destination}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Pickup Location:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>{event.pickupLocation}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Pickup Date:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>{event.pickupDate}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Pickup Time:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>{event.pickupTime}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Price:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>£{event.price}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Created By:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>{event.organizerName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Payment Required:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>
          {event.requirePayment ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.onBackground }]}>Seats Available:</Text>
        <Text style={[styles.value, { color: colors.onBackground }]}>
          {event.seatsAvailable - (event.seatsBooked ?? 0)} / {event.seatsAvailable}
        </Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <Text variant="titleMedium" style={[styles.sectionHeader, { color: colors.onBackground }]}>
        Join Event
      </Text>

      <TextInput
        label="Number of Seats Required"
        value={seatsRequired}
        onChangeText={setSeatsRequired}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleJoinEvent}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Join Event
      </Button>

      {!!error && (
        <HelperText type="error" visible>
          {String(error)}
        </HelperText>
      )}

      <Divider style={{ marginVertical: 16 }} />

      <Button
        mode="contained"
        onPress={() => handleViewEventBookings(event)}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        View Bookings
      </Button>

      <PaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentCancel}
        onSubmit={handlePaymentSubmit}
        amount={event.price * Number(seatsRequired || 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
    sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
});