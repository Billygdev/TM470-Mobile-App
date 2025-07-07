import React from 'react';
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

  // Optional booking props
  seatsBooked?: number;
  payed?: boolean;
  createdAt?: any; // Firestore Timestamp or Date
  onPayPress?: () => void;
};

export function TravelEventCard({
  title,
  destination,
  pickupLocation,
  pickupDate,
  pickupTime,
  price,
  onPress,
  seatsBooked,
  payed,
  createdAt,
  onPayPress,
}: TravelEventCardProps) {
  const { dark } = useTheme();

  const hasBookingData = seatsBooked !== undefined ||
    payed !== undefined ||
    createdAt !== undefined;
  
  const formattedCreatedAt = createdAt?.toDate ?
    createdAt.toDate().toLocaleString() :
    createdAt;

  return (
    <Card style={styles.card}>
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

              <View style={styles.bookingRow}>
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

                {!payed && (
                  <View style={styles.payButtonWrapper}>
                    <Button
                      mode="contained"
                      onPress={onPayPress}
                      compact
                      style={styles.payButton}
                    >
                      Pay Now
                    </Button>
                  </View>
                )}
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
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  payButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  payButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
