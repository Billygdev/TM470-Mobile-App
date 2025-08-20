import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';

type TravelEventCardProps = {
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: number;
  onPress?: () => void;
  testID?: string;

  // Optional booking props
  seatsBooked?: number;
  payed?: boolean;
  createdAt?: any; // Firestore Timestamp or Date
  onPayPress?: () => void;
  isCancelling?: boolean;
  onCancelPress?: () => void;
};

export function TravelEventCard({
  title,
  destination,
  pickupLocation,
  pickupDate,
  pickupTime,
  price,
  onPress,
  testID,
  seatsBooked,
  payed,
  createdAt,
  onPayPress,
  isCancelling,
  onCancelPress,
}: TravelEventCardProps) {
  const { dark } = useTheme();

  const hasBookingData = seatsBooked !== undefined ||
    payed !== undefined ||
    createdAt !== undefined;
  
  const formattedCreatedAt = createdAt?.toDate ?
    createdAt.toDate().toLocaleString() :
    createdAt;

  return (
    <Card
      style={styles.card}
      testID={testID}
    >
      <TouchableRipple
        onPress={onPress}
        rippleColor={dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
        borderless={false}
        style={styles.ripple}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>{title}</Text>
            <Text style={styles.price}>£{price}</Text>
          </View>
          <Text><Text style={styles.label}>Destination:</Text> {destination}</Text>
          <Text><Text style={styles.label}>Pickup Location:</Text> {pickupLocation}</Text>
          <Text><Text style={styles.label}>Pickup Date:</Text> {pickupDate} {pickupTime}</Text>

          {hasBookingData && (
            <>
              <Divider style={styles.divider} />
              
              <View style={styles.bookingDetails}>
                {seatsBooked !== undefined && (
                  <Text>
                    <Text style={styles.label}>Seats Booked:</Text> {seatsBooked}
                  </Text>
                )}
                {payed !== undefined && (
                  <Text>
                    <Text style={styles.label}>Payment Status:</Text> {payed ? 'Paid' : 'Unpaid'}
                  </Text>
                )}
                {createdAt && (
                  <Text>
                    <Text style={styles.label}>Booked At:</Text> {formattedCreatedAt}
                  </Text>
                )}
              </View>

              <View style={styles.actionRow}>
                {!payed && (
                  <Button
                    mode="contained"
                    compact
                    onPress={onPayPress}
                    style={styles.payButton}
                  >
                    Pay Now
                  </Button>
                )}

                <View style={{ flex: 1 }} />
                
                <Button
                  mode="outlined"
                  compact
                  onPress={onCancelPress}
                  style={styles.cancelButton}
                  loading={isCancelling}
                  disabled={isCancelling}
                >
                  Cancel Booking
                </Button>
              </View>
            </>
          )}
        </View>
      </TouchableRipple>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  ripple: {
    borderRadius: 4,
  },
  inner: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  price: {
    fontWeight: '600',
  },
  label: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  bookingHeading: {
    marginBottom: 4,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payButton: {
    flex: 1,
  },
  cancelButton: {
    alignSelf: 'flex-end',
  },
});
