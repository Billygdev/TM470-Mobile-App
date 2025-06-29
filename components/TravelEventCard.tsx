import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

type TravelEventCardProps = {
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: number;
};

export function TravelEventCard({
  title,
  destination,
  pickupLocation,
  pickupDate,
  pickupTime,
  price,
}: TravelEventCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>{title}</Text>
          <Text style={styles.price}>£{price}</Text>
        </View>
        <Text><strong>Destination:</strong> {destination}</Text>
        <Text><strong>Pickup Location:</strong> {pickupLocation}</Text>
        <Text><strong>Pickup Date:</strong> {pickupDate} {pickupTime}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  price: {
    fontWeight: '600',
  },
});
