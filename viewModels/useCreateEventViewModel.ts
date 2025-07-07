import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { createTravelEvent } from '@/models/firestoreEventModel';
import { validateTravelEventFields } from '@/scripts/validateTravelEventFields';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useCreateEventViewModel() {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [price, setPrice] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [requirePayment, setRequirePayment] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const handleCreateEvent = async () => {
    setError('');

    const validationError = validateTravelEventFields({
      title,
      destination,
      pickupLocation,
      pickupDate,
      pickupTime,
      price,
      seatsAvailable,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await createTravelEvent({
        title,
        destination,
        pickupLocation,
        pickupDate,
        pickupTime,
        price: Number(price),
        seatsAvailable: Number(seatsAvailable),
        requirePayment,
        organizerName: user!.displayName!,
        organizerUid: user!.uid,
      });

      showSnackbar({ message: 'Event created successfully!', type: 'success' });

      router.back();
    } catch (err: any) {
      console.error('Create event error:', err);

      setError(err.message || 'Something went wrong.');

      showSnackbar({
        message: err.message || 'Create event failed.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => router.back();

  return {
    title,
    setTitle,
    destination,
    setDestination,
    pickupLocation,
    setPickupLocation,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    price,
    setPrice,
    seatsAvailable,
    setSeatsAvailable,
    requirePayment,
    setRequirePayment,
    loading,
    error,
    handleCreateEvent,
    navigateBack,
  };
}