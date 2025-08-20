import { ThemeProvider } from '@/contexts/ThemeContext';
import TravelEventDetailsScreen from '@/views/TravelEventDetailsScreen';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
const mockJoinEvent = jest.fn();
const mockPaymentSubmit = jest.fn();
const mockPaymentCancel = jest.fn();
const mockViewBookings = jest.fn();
const mockPayNow = jest.fn();
const mockCancelBooking = jest.fn();

jest.mock('@/viewModels/useTravelEventDetailsViewModel', () => ({
  useTravelEventDetailsViewModel: () => ({
    event: {
      id: 'e1',
      title: 'Away Game',
      destination: 'Stadium',
      pickupLocation: 'Main Street',
      pickupDate: '2025-09-01',
      pickupTime: '10:00',
      price: 25,
      organizerName: 'Billy',
      requirePayment: true,
      seatsAvailable: 50,
      seatsBooked: 10,
    },
    seatsRequired: '2',
    setSeatsRequired: jest.fn(),
    handleJoinEvent: mockJoinEvent,
    handlePaymentSubmit: mockPaymentSubmit,
    showPaymentModal: false,
    handlePaymentCancel: mockPaymentCancel,
    error: '',
    loading: false,
    handleViewEventBookings: mockViewBookings,
    booking: null,
    handlePayNow: mockPayNow,
    paymentAmount: 50,
    handleCancelBooking: mockCancelBooking,
    isCancelling: false,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'e1' }),
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

test('renders event details', async () => {
  renderWithProviders(<TravelEventDetailsScreen />);

  // Assert event details are displayed
  const root = await screen.findByTestId('event-details-screen-root');
  expect(root).toHaveTextContent(/Travel Event/);
  expect(root).toHaveTextContent(/Away Game/);
  expect(root).toHaveTextContent(/Stadium/);
  expect(root).toHaveTextContent(/Billy/);
});

test('allows user to join event', async () => {
  renderWithProviders(<TravelEventDetailsScreen />);

  // Press Join Event button
  const joinButton = await screen.findByLabelText('Join Event');
  fireEvent.press(joinButton);

  // Assert join handler was called
  expect(mockJoinEvent).toHaveBeenCalled();
});

test('navigates to bookings when View Bookings pressed', async () => {
  renderWithProviders(<TravelEventDetailsScreen />);

  // Press View Bookings button
  const button = await screen.findByLabelText('View Bookings');
  fireEvent.press(button);

  // Assert navigation handler was called
  expect(mockViewBookings).toHaveBeenCalled();
});