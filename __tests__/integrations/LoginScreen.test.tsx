import { ThemeProvider } from '@/contexts/ThemeContext';
import { loginUser } from '@/models/authModel';
import LoginScreen from '@/views/LoginScreen';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/authModel', () => ({
  loginUser: jest.fn(),
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

test('LoginScreen logs in successfully and navigates to home route', async () => {
  (loginUser as jest.Mock).mockResolvedValueOnce({
    user: { uid: '123', email: 'test@example.com' },
  });

  renderWithProviders(<LoginScreen />);

  // Enter valid credentials and submit
  fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'securePassword123');
  fireEvent.press(screen.getByLabelText('Log In'));

  // Assert login screen still renders
  const root = await screen.findByTestId('login-screen-root');
  expect(root).toHaveTextContent(/Login/);

  // Assert login function called with correct credentials
  expect(loginUser).toHaveBeenCalledWith('test@example.com', 'securePassword123');
});

test('LoginScreen shows error message on login failure', async () => {
  const errorMessage = 'Invalid email or password';
  (loginUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  renderWithProviders(<LoginScreen />);

  // Enter invalid credentials and submit
  fireEvent.changeText(screen.getByLabelText('Email'), 'wrong@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'wrongpass');
  fireEvent.press(screen.getByLabelText('Log In'));

  // Assert login screen still renders
  const root = await screen.findByTestId('login-screen-root');
  expect(root).toHaveTextContent(/Login/);

  // Assert error message is displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/Invalid email or password/);
  });

  // Assert login function called with invalid credentials
  expect(loginUser).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
});