import { PaymentModal } from '@/components/PaymentModal';
import { useTravelEventDetailsViewModel } from '@/viewModels/useTravelEventDetailsViewModel';
import { useRouter } from 'expo-router';
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
    booking,
    handlePayNow,
    paymentAmount,
    handleCancelBooking,
    isCancelling,
  } = useTravelEventDetailsViewModel();

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.onBackground }}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View
      testID="event-details-screen-root"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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

      {!booking ? (
        <View>
          <Text variant="titleMedium" style={[styles.sectionHeader, { color: colors.onBackground }]}>
            Join Event
          </Text>

          <TextInput
            label="Number of Seats Required"
            accessibilityLabel="Number of Seats Required"
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
            accessibilityLabel="Join Event"
          >
            Join Event
          </Button>
        </View>
      ) : (
        <View>
          <View style={styles.sectionHeaderWithIcon}>
            <Text variant="titleMedium" style={[styles.sectionHeader, { color: colors.onBackground }]}>
              Manage Booking
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.onBackground }]}>Seats Booked:</Text>
            <Text style={[styles.value, { color: colors.onBackground }]}>{booking.seatsBooked}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.onBackground }]}>Paid:</Text>
            <Text style={[styles.value, { color: colors.onBackground }]}>{booking.payed ? 'Yes' : 'No'}</Text>
          </View>

          <View style={styles.actionRow}>
            {!booking.payed && (
              <Button
                mode="contained"
                compact
                onPress={handlePayNow}
                style={styles.payButton}
                accessibilityLabel="Pay Now"
              >
                Pay Now
              </Button>
            )}

            <Button
              mode="outlined"
              compact
              onPress={handleCancelBooking}
              style={styles.cancelButton}
              loading={isCancelling}
              disabled={isCancelling}
              accessibilityLabel="Cancel Booking"
            >
              Cancel Booking
            </Button>
          </View>
        </View>
      )}

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
        accessibilityLabel="View Bookings"
      >
        View Bookings
      </Button>

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
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
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
  },
  actionRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payButton: {
    flex: 1,
    marginRight: 8
  },
  cancelButton: {
    alignSelf: 'flex-end',
  },
});