import { ThemeProvider } from '@/contexts/ThemeContext';
import { getTravelEventById, updateTravelEvent } from '@/models/firestoreEventModel';
import { validateTravelEventFields } from '@/scripts/validateTravelEventFields';
import EditEventScreen from '@/views/EditEventScreen';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/firestoreEventModel', () => ({
  updateTravelEvent: jest.fn(),
  getTravelEventById: jest.fn(),
}));

jest.mock('@/scripts/validateTravelEventFields', () => ({
  validateTravelEventFields: jest.fn(),
}));

jest.mock('@/contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: () => ({ eventId: 'event123' }),
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

beforeEach(() => {
  jest.clearAllMocks();
});

const mockEvent = {
  title: 'Test Match',
  destination: 'Leeds',
  pickupLocation: 'Nottingham',
  pickupDate: '01/01/2026',
  pickupTime: '08:00',
  price: 20,
  seatsAvailable: 40,
  requirePayment: true,
};

// Tests
test('EditEventScreen updates event successfully and navigates back', async () => {
  (getTravelEventById as jest.Mock).mockResolvedValueOnce(mockEvent);
  (validateTravelEventFields as jest.Mock).mockReturnValueOnce('');

  renderWithProviders(<EditEventScreen />);

  // Assert existing values are pre-filled
  await waitFor(() => {
    expect(screen.getByLabelText('Event Title')).toHaveProp('value', 'Test Match');
    expect(screen.getByLabelText('Destination')).toHaveProp('value', 'Leeds');
  });

  // Update title field
  fireEvent.changeText(screen.getByLabelText('Event Title'), 'Updated Match');
  
  // Submit the form
  fireEvent.press(screen.getByTestId('create-button-text'));

  // Assert update called and navigation triggered
  await waitFor(() => {
    expect(updateTravelEvent).toHaveBeenCalledWith(
      'event123',
      expect.objectContaining({ title: 'Updated Match' })
    );

    expect(mockBack).toHaveBeenCalled();
  });
});

test('EditEventScreen shows validation error when required fields are empty', async () => {
  (getTravelEventById as jest.Mock).mockResolvedValueOnce(mockEvent);
  (validateTravelEventFields as jest.Mock).mockReturnValueOnce('All fields are required.');

  renderWithProviders(<EditEventScreen />);

  // Assert existing title is pre-filled
  await waitFor(() => {
    expect(screen.getByLabelText('Event Title')).toHaveProp('value', 'Test Match');
  });

  // Clear all fields
  fireEvent.changeText(screen.getByLabelText('Event Title'), '');
  fireEvent.changeText(screen.getByLabelText('Destination'), '');
  fireEvent.changeText(screen.getByLabelText('Pickup Location'), '');
  fireEvent.changeText(screen.getByLabelText('Pickup Date'), '');
  fireEvent.changeText(screen.getByLabelText('Pickup Time'), '');
  fireEvent.changeText(screen.getByLabelText('Price'), '');
  fireEvent.changeText(screen.getByLabelText('Seats Available'), '');

  // Try to submit with missing fields
  fireEvent.press(screen.getByTestId('create-button-text'));

  // Assert error message is shown
  const root = await screen.findByTestId('event-form-screen-root');
  await waitFor(() => {
    expect(root).toHaveTextContent(/All fields are required/i);
  });

  // Assert update was not attempted
  expect(updateTravelEvent).not.toHaveBeenCalled();
});
