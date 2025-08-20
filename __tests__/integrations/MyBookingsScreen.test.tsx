import { ThemeProvider } from '@/contexts/ThemeContext';
import { subscribeToUserTravelEventBookings } from '@/models/firestoreEventModel';
import MyBookingsScreen from '@/views/MyBookingsScreen';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/firestoreEventModel', () => ({
  subscribeToUserTravelEventBookings: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user123' } }),
}));

jest.mock('@/contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
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

const mockBooking = {
  eventId: 'event1',
  bookingId: 'booking1',
  event: {
    title: 'Coach to Wembley',
    destination: 'London',
    pickupLocation: 'Mansfield',
    pickupDate: '01/09/2025',
    pickupTime: '10:00',
    price: 25,
  },
  booking: {
    seatsBooked: 2,
    payed: false,
    createdAt: { toDate: () => new Date('2025-08-01T11:00:00') },
  },
};

// Tests
test('renders a booking card with correct details', async () => {
  (subscribeToUserTravelEventBookings as jest.Mock).mockImplementationOnce((_uid, cb) => {
    cb([mockBooking], false);
    return jest.fn();
  });

  renderWithProviders(<MyBookingsScreen />);

  const root = await screen.findByTestId('my-bookings-screen-root');

  // Assert booking details are displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/Coach to Wembley/);
    expect(root).toHaveTextContent(/Payment Status:/i);
    expect(root).toHaveTextContent(/Unpaid/i);
    expect(root).toHaveTextContent(/Seats Booked:/i);
    expect(root).toHaveTextContent(/2/);
  });
});

test('shows "No bookings found" when bookings list is empty', async () => {
  (subscribeToUserTravelEventBookings as jest.Mock).mockImplementationOnce((_uid, cb) => {
    cb([], false);
    return jest.fn();
  });

  renderWithProviders(<MyBookingsScreen />);

  const root = await screen.findByTestId('my-bookings-screen-root');

  // Assert empty state message is displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/No bookings found/i);
  });
});