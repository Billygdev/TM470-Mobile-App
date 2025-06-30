import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { createTravelEventBooking, getTravelEventById } from '@/models/firestoreEventModel';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export function useTravelEventDetailsViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [seatsRequired, setSeatsRequired] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const getEvent = async () => {
      try {
        const fetchedEvent = await getTravelEventById(id);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    if (id) {
      getEvent();
    }
  }, [id]);

  const validateField = () => {
    const numericValue = Number(seatsRequired);

    if (!seatsRequired) {
      return 'Number of seats is required.';
    }

    if (isNaN(numericValue) || !Number.isInteger(numericValue)) {
      return 'Number of seats must be a whole number.';
    }

    if (numericValue <= 0) {
      return 'You must book at least 1 seat.';
    }

    return '';
  };

  const handleJoinEvent = async () => {
    setError('');

    const validationError = validateField();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await createTravelEventBooking(event.id, {
        seatsBooked: Number(seatsRequired),
        payed: false,
        bookerName: user!.displayName!,
        bookerUid: user!.uid,
      });

      // Refetch the updated event details
      const updatedEvent = await getTravelEventById(event.id);
      setEvent(updatedEvent);

      setSeatsRequired('');

      showSnackbar({ message: 'Event joined successfully!', type: 'success' });
    } catch (err: any) {
      console.error('Create event error:', err);

      setError(err.message || 'Something went wrong.');

      showSnackbar({
        message: err.message || 'Event joining failed.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    event,
    seatsRequired,
    setSeatsRequired,
    handleJoinEvent,
    error,
    loading,
  };
}