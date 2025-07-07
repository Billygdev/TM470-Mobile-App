import { PaymentModal } from '@/components/PaymentModal';
import { TravelEventCard } from '@/components/TravelEventCard';
import { useMyBookingsViewModel } from '@/viewModels/useMyBookingsViewModel';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export default function MyBookingsScreen() {
  const { colors } = useTheme();
  const {
    eventsAndBookings,
    loading,
    handleEventPress,
    handlePayNow,
    showPaymentModal,
    handlePaymentCancel,
    handlePaymentSubmit,
    paymentAmount,
    isCancelling,
    handleCancelBooking,
  } = useMyBookingsViewModel();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        My Bookings
      </Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : eventsAndBookings.length === 0 ? (
        <Text style={[styles.emptyMessage, { color: colors.onBackground }]}>
          No bookings found.
        </Text>
      ) : (
        <FlatList
          data={eventsAndBookings}
          keyExtractor={item => `${item.eventId}-${item.bookingId}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TravelEventCard
              // Event data
              title={item.event.title}
              destination={item.event.destination}
              pickupLocation={item.event.pickupLocation}
              pickupDate={item.event.pickupDate}
              pickupTime={item.event.pickupTime}
              price={item.event.price}
              onPress={() => handleEventPress(item.event)}

              // Booking data
              seatsBooked={item.booking.seatsBooked}
              payed={item.booking.payed}
              createdAt={item.booking.createdAt}
              onPayPress={() => handlePayNow(item)}
              isCancelling={isCancelling}
              onCancelPress={() => handleCancelBooking(item)}
            />
          )}
        />
      )}

      <PaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentCancel}
        onSubmit={handlePaymentSubmit}
        amount={paymentAmount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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