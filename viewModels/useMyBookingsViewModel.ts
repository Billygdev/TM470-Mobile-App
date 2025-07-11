import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import {
  cancelTravelEventBooking,
  subscribeToUserTravelEventBookings,
  TravelEvent,
  updateTravelEventBooking,
  UserBookingWithEvent
} from '@/models/firestoreEventModel';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function useMyBookingsViewModel() {
  const [eventsAndBookings, setEventsAndBookings] = useState<UserBookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentEventId, setPaymentEventId] = useState('');
  const [paymentBookingId, setPaymentBookingId] = useState('');

  const router = useRouter();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserTravelEventBookings(user.uid, (bookings) => {
      setEventsAndBookings(bookings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEventPress = (event: TravelEvent) => {
    router.push({
      pathname: '/travel-event-details',
      params: { id: event.id },
    });
  };

  const handlePayNow = (eventAndBooking: UserBookingWithEvent) => {
    setPaymentAmount(
      eventAndBooking.event.price * eventAndBooking.booking.seatsBooked
    );

    setPaymentEventId(eventAndBooking.eventId);
    setPaymentBookingId(eventAndBooking.bookingId);

    setShowPaymentModal(true);
  };

  const handleCancelBooking = async (
    eventAndBooking: UserBookingWithEvent
  ) => {
    const confirm = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (confirm) {
      setIsCancelling(true);

      try {
        await cancelTravelEventBooking(
          eventAndBooking.eventId,
          eventAndBooking.bookingId
        )

        showSnackbar({
          message: `Your booking for ${eventAndBooking.event.title} was cancelled.`,
          type: 'success',
        });
      } catch (err: any) {
        console.error(err);
        showSnackbar({ message: err.message || 'Booking cancellation failed.', type: 'error' });
      } finally {
        setIsCancelling(false);
      }
    }
  };

  // Payment form submission handler
  const handlePaymentSubmit = async (cardDetails: any) => {
    try {
      console.log('Card details:', cardDetails);

      await updateTravelEventBooking(
        paymentEventId,
        paymentBookingId,
        true // payed
      );

      showSnackbar({ message: 'Payment successful.', type: 'success' });
    } catch (err: any) {
      console.error(err);
      showSnackbar({ message: err.message || 'Payment failed.', type: 'error' });
    } finally {
      setShowPaymentModal(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setPaymentAmount(0);
    setPaymentEventId('');
    setPaymentBookingId('');

    showSnackbar({
      message: 'Payment cancelled.',
      type: 'warn',
    });
  };

  return {
    eventsAndBookings,
    loading,
    handleEventPress,
    handlePayNow,
    showPaymentModal,
    handlePaymentSubmit,
    handlePaymentCancel,
    paymentAmount,
    paymentEventId,
    paymentBookingId,
    isCancelling,
    handleCancelBooking,
  };
}