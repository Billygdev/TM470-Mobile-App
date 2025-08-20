import { ThemeProvider } from '@/contexts/ThemeContext';
import { registerUser } from '@/models/authModel';
import SignUpScreen from '@/views/SignUpScreen';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('@/models/authModel', () => ({
  registerUser: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockShowSnackbar = jest.fn();
jest.mock('@/contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
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

test('SignUpScreen registers successfully and navigates to login', async () => {
  (registerUser as jest.Mock).mockResolvedValueOnce(undefined);

  renderWithProviders(<SignUpScreen />);

  // Fill in form fields
  fireEvent.changeText(screen.getByLabelText('Username'), 'Billy');
  fireEvent.changeText(screen.getByLabelText('Email'), 'billy@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'mypassword');
  fireEvent.changeText(screen.getByLabelText('Confirm Password'), 'mypassword');

  // Submit the form
  fireEvent.press(screen.getByLabelText('Create Account'));

  const root = await screen.findByTestId('signup-screen-root');

  // Assert account created, success message shown, and navigation triggered
  await waitFor(() => {
    expect(registerUser).toHaveBeenCalledWith('billy@example.com', 'mypassword', 'Billy');
    
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'Account created successfully!',
      type: 'success',
    });
    
    // Assert screen still renders
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  expect(root).toHaveTextContent(/Sign Up/);
});

test('SignUpScreen shows validation error when fields are missing', async () => {
  renderWithProviders(<SignUpScreen />);

  // Try to submit with empty fields
  fireEvent.press(screen.getByLabelText('Create Account'));

  const root = await screen.findByTestId('signup-screen-root');

  // Assert validation error message is shown
  await waitFor(() => {
    expect(root).toHaveTextContent(/All fields are required/i);
  });

  // Assert register was not called
  expect(registerUser).not.toHaveBeenCalled();
});

test('SignUpScreen shows error when passwords do not match', async () => {
  renderWithProviders(<SignUpScreen />);

  // Fill in mismatched passwords
  fireEvent.changeText(screen.getByLabelText('Username'), 'Billy');
  fireEvent.changeText(screen.getByLabelText('Email'), 'billy@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'password1');
  fireEvent.changeText(screen.getByLabelText('Confirm Password'), 'password2');

  // Submit the form
  fireEvent.press(screen.getByLabelText('Create Account'));

  const root = await screen.findByTestId('signup-screen-root');

  // Assert mismatch error is displayed
  await waitFor(() => {
    expect(root).toHaveTextContent(/Passwords do not match/);
  });

  // Assert register was not called
  expect(registerUser).not.toHaveBeenCalled();
});

test('SignUpScreen shows backend error when registerUser fails', async () => {
  (registerUser as jest.Mock).mockRejectedValueOnce(new Error('Email already exists'));

  renderWithProviders(<SignUpScreen />);

  // Fill in valid form fields
  fireEvent.changeText(screen.getByLabelText('Username'), 'Billy');
  fireEvent.changeText(screen.getByLabelText('Email'), 'billy@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'mypassword');
  fireEvent.changeText(screen.getByLabelText('Confirm Password'), 'mypassword');

  // Submit the form
  fireEvent.press(screen.getByLabelText('Create Account'));

  const root = await screen.findByTestId('signup-screen-root');

  // Assert backend error is displayed and snackbar shown
  await waitFor(() => {
    expect(root).toHaveTextContent(/Email already exists/);

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'Email already exists',
      type: 'error',
    });
  });
});

test('SignUpScreen navigates to login when Cancel is pressed', async () => {
  renderWithProviders(<SignUpScreen />);

  // Press cancel button
  fireEvent.press(screen.getByLabelText('Cancel'));

  // Assert navigation to login
  expect(mockReplace).toHaveBeenCalledWith('/login');
});
