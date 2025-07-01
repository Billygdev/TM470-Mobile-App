import { useCreateEventViewModel } from '@/viewModels/useCreateEventViewModel';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Checkbox,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function CreateEventScreen() {
  const { colors } = useTheme();
  const {
    title,
    setTitle,
    destination,
    setDestination,
    pickupLocation,
    setPickupLocation,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    price,
    setPrice,
    seatsAvailable,
    setSeatsAvailable,
    requirePayment,
    setRequirePayment,
    loading,
    error,
    handleCreateEvent,
    navigateToHome,
  } = useCreateEventViewModel();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}> 
        Create Event
      </Text>

      <TextInput
        label="Event Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Destination"
        mode="outlined"
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />

      <TextInput
        label="Pickup Location"
        mode="outlined"
        value={pickupLocation}
        onChangeText={setPickupLocation}
        style={styles.input}
      />

      <TextInput
        label="Pickup Date"
        mode="outlined"
        value={pickupDate}
        onChangeText={setPickupDate}
        placeholder="DD/MM/YYYY"
        style={styles.input}
      />

      <TextInput
        label="Pickup Time"
        mode="outlined"
        value={pickupTime}
        onChangeText={setPickupTime}
        placeholder="HH:MM"
        style={styles.input}
      />

      <TextInput
        label="Price"
        mode="outlined"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
        left={<TextInput.Icon icon={() => <Text style={{ fontSize: 16 }}>£</Text>} />}
      />

      <TextInput
        label="Seats Available"
        mode="outlined"
        value={seatsAvailable}
        onChangeText={setSeatsAvailable}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={requirePayment ? 'checked' : 'unchecked'}
          onPress={() => setRequirePayment(!requirePayment)}
        />
        <Text style={{ color: colors.onBackground, marginLeft: 8 }}>Require payment</Text>
      </View>

      {!!error && (
        <HelperText type="error" visible>
          {String(error)}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleCreateEvent}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Create Event
      </Button>

      <Button
        mode="text"
        onPress={navigateToHome}
        style={styles.button}
      >
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});