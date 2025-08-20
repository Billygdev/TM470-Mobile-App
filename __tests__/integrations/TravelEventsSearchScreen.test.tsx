import { ThemeProvider } from '@/contexts/ThemeContext';
import TravelEventsSearchScreen from '@/views/TravelEventsSearchScreen';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
const mockSetSearchQuery = jest.fn();
const mockHandleEventPress = jest.fn();

jest.mock('@/viewModels/useTravelEventsSearchViewModel', () => ({
  useTravelEventsSearchViewModel: jest.fn(),
}));

const { useTravelEventsSearchViewModel } = require('@/viewModels/useTravelEventsSearchViewModel');

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
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

test('renders loading state', async () => {
  // Mock view model to return loading state
  (useTravelEventsSearchViewModel as jest.Mock).mockReturnValue({
    events: [],
    loading: true,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    handleEventPress: mockHandleEventPress,
  });

  renderWithProviders(<TravelEventsSearchScreen />);

  // Assert loading indicator is shown
  expect(await screen.findByTestId('activity-indicator')).toBeTruthy();
});

test('renders empty state when no events', async () => {
  // Mock view model to return no events
  (useTravelEventsSearchViewModel as jest.Mock).mockReturnValue({
    events: [],
    loading: false,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    handleEventPress: mockHandleEventPress,
  });

  renderWithProviders(<TravelEventsSearchScreen />);

  // Assert empty state message is shown
  expect(await screen.findByTestId('empty-events-message')).toBeTruthy();
});

test('renders list of events', async () => {
  // Mock view model to return one event
  (useTravelEventsSearchViewModel as jest.Mock).mockReturnValue({
    events: [
      {
        id: 'e1',
        title: 'Coach Trip',
        destination: 'City',
        pickupLocation: 'Main Road',
        pickupDate: '01/09/2025',
        pickupTime: '10:00',
        price: 20
      },
    ],
    loading: false,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    handleEventPress: mockHandleEventPress,
  });

  renderWithProviders(<TravelEventsSearchScreen />);

  // Assert event card is displayed
  expect(await screen.findByTestId('event-card-e1')).toBeTruthy();
});

test('updates search query when typing', async () => {
  // Mock view model with empty state
  (useTravelEventsSearchViewModel as jest.Mock).mockReturnValue({
    events: [],
    loading: false,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    handleEventPress: mockHandleEventPress,
  });

  renderWithProviders(<TravelEventsSearchScreen />);

  // Type into search input
  const searchInput = await screen.findByLabelText(/Search Events/);
  fireEvent.changeText(searchInput, 'Coach');

  // Assert search query updated
  expect(mockSetSearchQuery).toHaveBeenCalledWith('Coach');
});

test('handles event press', async () => {
  // Mock view model to return one event
  (useTravelEventsSearchViewModel as jest.Mock).mockReturnValue({
    events: [
      {
        id: 'e1',
        title: 'Coach Trip',
        destination: 'City',
        pickupLocation: 'Main Road',
        pickupDate: '01/09/2025',
        pickupTime: '10:00',
        price: 20
      },
    ],
    loading: false,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    handleEventPress: mockHandleEventPress,
  });

  renderWithProviders(<TravelEventsSearchScreen />);

  // Press event card
  const card = await screen.findByTestId('event-card-e1');
  fireEvent.press(card);
  
  // Assert event press handler was called with correct event
  expect(mockHandleEventPress).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'e1' })
  );
});
