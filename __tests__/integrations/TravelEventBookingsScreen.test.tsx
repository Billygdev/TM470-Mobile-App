import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  getTravelEventBookings,
  getTravelEventCancellations,
} from '@/models/firestoreEventModel';
import TravelEventBookingsScreen from '@/views/TravelEventBookingsScreen';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/firestoreEventModel', () => ({
  getTravelEventBookings: jest.fn(),
  getTravelEventCancellations: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({ id: 'event123' }),
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

test('renders bookings and cancellations', async () => {
  // Mock return one booking
  (getTravelEventBookings as jest.Mock).mockResolvedValueOnce([
    { id: 'b1', bookerName: 'Alice', seatsBooked: 2, payed: true },
  ]);
  
  // Mock return one cancellation
  (getTravelEventCancellations as jest.Mock).mockResolvedValueOnce([
    { id: 'c1', bookerName: 'Bob', seatsBooked: 1, payed: false },
  ]);

  renderWithProviders(<TravelEventBookingsScreen />);

  const root = await screen.findByTestId('bookings-screen-root');
  expect(root).toHaveTextContent(/Event Bookings/);

  // Assert booking and cancellation details are displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/Alice/);
    expect(root).toHaveTextContent(/2/);
    expect(root).toHaveTextContent(/Yes/);

    expect(root).toHaveTextContent(/Bob/);
    expect(root).toHaveTextContent(/1/);
    expect(root).toHaveTextContent(/No/);
  });
});

test('shows empty state when no bookings or cancellations', async () => {
  // Mock no bookings and no cancellations
  (getTravelEventBookings as jest.Mock).mockResolvedValueOnce([]);
  (getTravelEventCancellations as jest.Mock).mockResolvedValueOnce([]);

  renderWithProviders(<TravelEventBookingsScreen />);

  const root = await screen.findByTestId('bookings-screen-root');

  // Assert empty state messages are shown
  await waitFor(() => {
    expect(root).toHaveTextContent(/No bookings/);
    expect(root).toHaveTextContent(/No cancellations/);
  });
});

test('shows error when fetch fails', async () => {
  (getTravelEventBookings as jest.Mock).mockRejectedValueOnce(new Error('boom'));
  (getTravelEventCancellations as jest.Mock).mockResolvedValueOnce([]);

  renderWithProviders(<TravelEventBookingsScreen />);

  const root = await screen.findByTestId('bookings-screen-root');

  // Assert error message is displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/Failed to load bookings/);
  });
});

test('navigates to attendance screen when Mark Attendance pressed', async () => {
  (getTravelEventBookings as jest.Mock).mockResolvedValueOnce([]);
  (getTravelEventCancellations as jest.Mock).mockResolvedValueOnce([]);

  renderWithProviders(<TravelEventBookingsScreen />);

  // Press Mark Attendance button
  const button = await screen.findByLabelText('Mark Attendance');
  fireEvent.press(button);

  // Assert navigation to attendance screen
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/travel-event-attendance',
    params: { id: 'event123' },
  });
});
