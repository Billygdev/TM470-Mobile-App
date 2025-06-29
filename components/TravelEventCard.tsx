import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, TouchableRipple, useTheme } from 'react-native-paper';

type TravelEventCardProps = {
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: number;
  onPress?: () => void;
};

export function TravelEventCard({
  title,
  destination,
  pickupLocation,
  pickupDate,
  pickupTime,
  price,
  onPress,
}: TravelEventCardProps) {
  const { dark } = useTheme();

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
          <Text><strong>Destination:</strong> {destination}</Text>
          <Text><strong>Pickup Location:</strong> {pickupLocation}</Text>
          <Text><strong>Pickup Date:</strong> {pickupDate} {pickupTime}</Text>
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
});
