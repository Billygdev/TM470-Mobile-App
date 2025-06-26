import { loginUser } from '@/models/authModel';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = async () => {
    router.replace('/signup');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    navigateToSignUp,
  };
};