import { useSnackbar } from '@/contexts/SnackbarContext';
import { registerUser } from '@/models/authModel';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useSignUpViewModel() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const validateFields = () => {
    if (!username || !email || !password || !confirmPassword) {
      return 'All fields are required.';
    }
    if (!email.includes('@')) {
      return 'Invalid email address.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSignUp = async () => {
    setError('');
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, username);

      showSnackbar({
        message: 'Account created successfully!',
        type: 'success',
      });

      router.replace('/login');
    } catch (err: any) {
      console.error('Sign up error:', err);

      setError(err.message || 'Something went wrong.');

      showSnackbar({
        message: err.message || 'Sign up failed.',
        type: 'error',
      });

    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = async () => {
    router.replace('/login');
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    handleSignUp,
    navigateToLogin,
  };
}
