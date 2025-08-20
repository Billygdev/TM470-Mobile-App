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

type EventFormProps = {
  title: string;
  setTitle: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  pickupLocation: string;
  setPickupLocation: (value: string) => void;
  pickupDate: string;
  setPickupDate: (value: string) => void;
  pickupTime: string;
  setPickupTime: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  seatsAvailable: string;
  setSeatsAvailable: (value: string) => void;
  requirePayment: boolean;
  setRequirePayment: (value: boolean) => void;
  loading: boolean;
  error?: string | null;
  onSubmit: () => void;
  onBack: () => void;
  submitLabel?: string;
  canCancel?: boolean | null;
  onCancelEvent?: () => void;
};

export const EventForm: React.FC<EventFormProps> = ({
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
  onSubmit,
  onBack,
  submitLabel = 'Submit',
  canCancel,
  onCancelEvent,
}) => {
  const { colors } = useTheme();

  return (
    <View
      testID="event-form-screen-root"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        {submitLabel} Event
      </Text>

      <TextInput
        label="Event Title"
        accessibilityLabel="Event Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Destination"
        accessibilityLabel="Destination"
        mode="outlined"
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />

      <TextInput
        label="Pickup Location"
        accessibilityLabel="Pickup Location"
        mode="outlined"
        value={pickupLocation}
        onChangeText={setPickupLocation}
        style={styles.input}
      />

      <TextInput
        label="Pickup Date"
        accessibilityLabel="Pickup Date"
        mode="outlined"
        value={pickupDate}
        onChangeText={setPickupDate}
        placeholder="DD/MM/YYYY"
        style={styles.input}
      />

      <TextInput
        label="Pickup Time"
        accessibilityLabel="Pickup Time"
        mode="outlined"
        value={pickupTime}
        onChangeText={setPickupTime}
        placeholder="HH:MM"
        style={styles.input}
      />

      <TextInput
        label="Price"
        accessibilityLabel="Price"
        mode="outlined"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
        left={<TextInput.Icon icon={() => <Text style={{ fontSize: 16 }}>£</Text>} />}
      />

      <TextInput
        label="Seats Available"
        accessibilityLabel="Seats Available"
        mode="outlined"
        value={seatsAvailable}
        onChangeText={setSeatsAvailable}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.checkboxContainer} testID="require-payment-checkbox">
        <Checkbox
          status={requirePayment ? 'checked' : 'unchecked'}
          onPress={() => setRequirePayment(!requirePayment)}
        />
        <Text style={{ color: colors.onBackground, marginLeft: 8 }}>
          Require payment
        </Text>
      </View>

      {!!error && (
        <HelperText type="error" visible>
          {String(error)}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
        testID="create-button"
      >
        {submitLabel}
      </Button>

      {canCancel && (
        <Button
          mode="contained"
          onPress={onCancelEvent}
          loading={loading}
          disabled={loading}
          style={styles.button}
          testID="cancel-button"
        >
          Cancel Event
        </Button>
      )}

      <Button
        mode="text"
        onPress={onBack}
        style={styles.button}
        testID="back-button"
      >
        Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
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