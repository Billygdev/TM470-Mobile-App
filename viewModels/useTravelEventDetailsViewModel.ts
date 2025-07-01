import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import {
  createTravelEventBooking,
  getTravelEventById,
  TravelEvent,
} from '@/models/firestoreEventModel';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export function useTravelEventDetailsViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<TravelEvent | null>(null);
  const [seatsRequired, setSeatsRequired] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<null | { seatsBooked: number }>(null);

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

    const numericSeats = Number(seatsRequired);

    if (event?.requirePayment) {
      setPendingBooking({ seatsBooked: numericSeats });

      showSnackbar({
        message: 'Instant payment is required.',
        type: 'success'
      });

      setShowPaymentModal(true);

      return;
    }

    const confirm = window.confirm('Would you like to pay now?');
    if (confirm) {
      setPendingBooking({ seatsBooked: numericSeats });
      setShowPaymentModal(true);
      
      return;
    }

    try {
      setLoading(true);
      await createTravelEventBooking(event!.id!, {
        seatsBooked: numericSeats,
        payed: false,
        bookerName: user!.displayName!,
        bookerUid: user!.uid,
      });

      // Refetch the updated event details
      const updatedEvent = await getTravelEventById(event!.id!);
      setEvent(updatedEvent);
      setSeatsRequired('');

      showSnackbar({ message: 'Booking saved, pending payment.', type: 'success' });
    } catch (err: any) {
      showSnackbar({ message: err.message || 'Booking failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Payment form submission handler
  const handlePaymentSubmit = async (cardDetails: any) => {
    try {
      console.log('Card details:', cardDetails);

      await createTravelEventBooking(event!.id!, {
        seatsBooked: pendingBooking!.seatsBooked,
        payed: true,
        bookerName: user!.displayName!,
        bookerUid: user!.uid,
      });

      const updated = await getTravelEventById(event!.id!);

      setEvent(updated);
      setSeatsRequired('');

      showSnackbar({ message: 'Payment successful and booking complete.', type: 'success' });
    } catch (err: any) {
      console.error(err);
      showSnackbar({ message: err.message || 'Payment failed.', type: 'error' });
    } finally {
      setShowPaymentModal(false);
      setPendingBooking(null);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);

    if (pendingBooking) {
      showSnackbar({
        message: 'Booking cancelled. Payment was not completed.',
        type: 'warn',
      });

      setPendingBooking(null);
    }
  };

  return {
    event,
    seatsRequired,
    setSeatsRequired,
    handleJoinEvent,
    handlePaymentSubmit,
    showPaymentModal,
    handlePaymentCancel,
    setShowPaymentModal,
    error,
    loading,
  };
}