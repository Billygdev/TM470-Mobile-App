import {
  getTravelEventBookings,
  getTravelEventCancellations,
  TravelEventBooking
} from '@/models/firestoreEventModel';
import { useEffect, useState } from 'react';

export const useTravelEventBookingsViewModel = (eventId: string) => {
  const [bookings, setBookings] = useState<TravelEventBooking[]>([]);
  const [cancellations, setCancellations] = useState<TravelEventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingData, cancellationData] = await Promise.all([
          getTravelEventBookings(eventId),
          getTravelEventCancellations(eventId)
        ]);
        
        setBookings(bookingData);
        setCancellations(cancellationData);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  return {
    bookings,
    cancellations,
    loading,
    error
  };
}
