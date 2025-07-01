import { useSnackbar } from '@/contexts/SnackbarContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

export function usePaymentViewModel() {
  const { seats, price } = useLocalSearchParams<{ seats: string; price: string }>();
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const amount = Number(price) * Number(seats);

  const handlePayment = () => {
    setError('');

    if (!nameOnCard || !cardNumber || !expiry || !securityCode) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(Number(cardNumber)) || cardNumber.length < 12) {
      setError('Card number is invalid.');
      return;
    }

    if (isNaN(Number(securityCode)) || securityCode.length < 3) {
      setError('Security code is invalid.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      showSnackbar({ message: 'Payment successful.', type: 'success' });

      router.replace('/');
    }, 1500);
  };

  const navigateBack = () => {
    router.back();
  };

  return {
    amount,
    nameOnCard,
    setNameOnCard,
    cardNumber,
    setCardNumber,
    expiry,
    setExpiry,
    securityCode,
    setSecurityCode,
    error,
    loading,
    handlePayment,
    navigateBack,
  };
}