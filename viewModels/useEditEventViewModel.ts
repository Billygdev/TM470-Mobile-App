import { TravelEvent, getTravelEventById, updateTravelEvent } from '@/models/firestoreEventModel';
import { validateTravelEventFields } from '@/scripts/validateTravelEventFields';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useEditEventViewModel() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [price, setPrice] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [requirePayment, setRequirePayment] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load event on mount
  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (!eventId) throw new Error('Missing event ID');
        const event: TravelEvent = await getTravelEventById(eventId);

        setTitle(event.title || '');
        setDestination(event.destination || '');
        setPickupLocation(event.pickupLocation || '');
        setPickupDate(event.pickupDate || '');
        setPickupTime(event.pickupTime || '');
        setPrice(event.price?.toString?.() || '');
        setSeatsAvailable(event.seatsAvailable?.toString?.() || '');
        setRequirePayment(event.requirePayment ?? false);
      } catch (err: any) {
        console.error('Failed to load event:', err);
        setError('Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleUpdateEvent = async () => {
    setSubmitting(true);
    setError('');

    try {
      if (!eventId) throw new Error('Missing event ID');

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

      await updateTravelEvent(eventId, {
        title,
        destination,
        pickupLocation,
        pickupDate,
        pickupTime,
        price: Number(price),
        seatsAvailable: Number(seatsAvailable),
        requirePayment,
      });

      Alert.alert('Success', 'Event updated successfully');
      router.back();
    } catch (err: any) {
      console.error('Failed to update event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setSubmitting(false);
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
    handleUpdateEvent,
    navigateBack,
    submittingUpdate: submitting,
  };
}