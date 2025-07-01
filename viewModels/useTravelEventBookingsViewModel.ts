import { useEffect, useState } from 'react';
import { getTravelEventBookings } from '../models/firestoreEventModel';

export const useTravelEventBookingsViewModel = (eventId: string) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const results = await getTravelEventBookings(eventId);
        setBookings(results);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchBookings();
    }
  }, [eventId]);

  return { bookings, loading, error };
};