import { ThemeProvider } from '@/contexts/ThemeContext';
import { createTravelEvent } from '@/models/firestoreEventModel';
import { validateTravelEventFields } from '@/scripts/validateTravelEventFields';
import CreateEventScreen from '@/views/CreateEventScreen';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/firestoreEventModel', () => ({
  createTravelEvent: jest.fn(),
}));

jest.mock('@/scripts/validateTravelEventFields', () => ({
  validateTravelEventFields: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user123', displayName: 'Billy' } }),
}));

jest.mock('@/contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <SafeAreaProvider>
        <PaperProvider>{ui}</PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

// Tests
beforeEach(() => {
  jest.clearAllMocks();
});

test('CreateEventScreen submits valid event and navigates back on success', async () => {
  (validateTravelEventFields as jest.Mock).mockReturnValueOnce('');
  (createTravelEvent as jest.Mock).mockResolvedValueOnce(undefined);

  renderWithProviders(<CreateEventScreen />);

  // Fill out form fields
  fireEvent.changeText(screen.getByLabelText('Event Title'), 'Coach to Wembley');
  fireEvent.changeText(screen.getByLabelText('Destination'), 'London');
  fireEvent.changeText(screen.getByLabelText('Pickup Location'), 'Mansfield');
  fireEvent.changeText(screen.getByLabelText('Pickup Date'), '01/01/2026');
  fireEvent.changeText(screen.getByLabelText('Pickup Time'), '08:00');
  fireEvent.changeText(screen.getByLabelText('Price'), '25.00');
  fireEvent.changeText(screen.getByLabelText('Seats Available'), '40');

  // Toggle require payment option
  fireEvent.press(screen.getByTestId('require-payment-checkbox'));

  // Submit the form
  fireEvent.press(screen.getByTestId('create-button-text'));

  // Assert event was created with expected data
  await waitFor(() => {
    expect(createTravelEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Coach to Wembley',
        destination: 'London',
        pickupLocation: 'Mansfield',
        pickupDate: '01/01/2026',
        pickupTime: '08:00',
        price: 25,
        seatsAvailable: 40,
        requirePayment: false,
        organizerUid: 'user123',
        organizerName: 'Billy',
      })
    );
  });
});

test('CreateEventScreen shows validation error when required fields are empty', async () => {
  (validateTravelEventFields as jest.Mock).mockReturnValueOnce('All fields are required.');

  renderWithProviders(<CreateEventScreen />);

  // Try submitting without filling in fields
  fireEvent.press(screen.getByTestId('create-button-text'));

  const root = await screen.findByTestId('event-form-screen-root');

  // Assert error message is displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/All fields are required/i);
  });
});