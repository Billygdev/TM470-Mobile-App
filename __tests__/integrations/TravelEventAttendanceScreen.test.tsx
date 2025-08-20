import { ThemeProvider } from '@/contexts/ThemeContext';
import { getTravelEventBookings, updateTravelEventBookingAttendance } from '@/models/firestoreEventModel';
import TravelEventAttendanceScreen from '@/views/TravelEventAttendanceScreen';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/firestoreEventModel', () => ({
  getTravelEventBookings: jest.fn(),
  updateTravelEventBookingAttendance: jest.fn(),
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
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

beforeEach(() => {
  jest.clearAllMocks();
});

// Tests
test('renders bookings and toggles attendance', async () => {
  (getTravelEventBookings as jest.Mock).mockResolvedValueOnce([
    { id: 'b1', bookerName: 'Alice', seatsBooked: 3, attended: false },
  ]);

  renderWithProviders(<TravelEventAttendanceScreen />);

  const root = await screen.findByTestId('attendance-screen-root');
  expect(root).toHaveTextContent(/Mark Attendance/);

  // Assert booking is displayed
  expect(await screen.findByTestId('booking-name-0')).toHaveTextContent('Alice');

  // Toggle attendance checkbox
  const checkboxWrapper = screen.getByTestId('attendance-checkbox-0');
  fireEvent.press(checkboxWrapper);

  // Assert seats value remains correct after toggle
  await waitFor(() => {
    expect(screen.getByLabelText('booking-seats-0').props.value).toBe('3');
  });
});

test('shows empty message when no bookings', async () => {
  (getTravelEventBookings as jest.Mock).mockResolvedValueOnce([]);

  renderWithProviders(<TravelEventAttendanceScreen />);

  // Assert empty state is shown
  expect(await screen.findByTestId('attendance-empty')).toHaveTextContent(/No bookings/);
});

test('shows error when loading fails', async () => {
  (getTravelEventBookings as jest.Mock).mockRejectedValueOnce(new Error('fail'));

  renderWithProviders(<TravelEventAttendanceScreen />);

  // Assert error state is shown
  expect(await screen.findByTestId('attendance-error')).toHaveTextContent(/Failed to load attendance data/);
});

test('saves attendance and navigates back', async () => {
  (getTravelEventBookings as jest.Mock).mockResolvedValueOnce([
    { id: 'b1', bookerName: 'Alice', seatsBooked: 3, attended: true, seatsAttended: 2 },
  ]);

  (updateTravelEventBookingAttendance as jest.Mock).mockResolvedValueOnce(undefined);

  renderWithProviders(<TravelEventAttendanceScreen />);

  // Press save attendance button
  fireEvent.press(await screen.findByLabelText('Save Attendance'));

  // Assert update API called and navigation triggered
  await waitFor(() => {
    expect(updateTravelEventBookingAttendance).toHaveBeenCalledWith('event123', 'b1', {
      attended: true,
      seatsAttended: 2,
    });
    
    expect(mockBack).toHaveBeenCalled();
  });
});
