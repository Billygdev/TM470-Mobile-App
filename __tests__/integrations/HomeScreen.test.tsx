import { ThemeProvider } from '@/contexts/ThemeContext';
import { getRecentNews } from '@/models/firestoreNewsModel';
import HomeScreen from '@/views/HomeScreen';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/firestoreNewsModel', () => ({
  getRecentNews: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { displayName: 'Billy' },
  }),
}));

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

test('HomeScreen displays welcome message and news article', async () => {
  (getRecentNews as jest.Mock).mockResolvedValueOnce([
    {
      id: 'n1',
      title: 'New Travel Option Released',
      description: 'Details about the new coach travel option.',
      date: { seconds: 1755024000 },
    },
  ]);

  renderWithProviders(<HomeScreen />);

  const root = await screen.findByTestId('home-screen-root');

  // Check text content
  expect(root).toHaveTextContent(/Sports Travel Organizer/);
  expect(root).toHaveTextContent(/Welcome\s*Billy/);

  // Wait for news to appear
  await waitFor(() => {
    expect(root).toHaveTextContent(/New Travel Option Released/);
    expect(root).toHaveTextContent(/Details about the new coach travel option/);
  });
});
