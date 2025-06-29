import { getTravelEventById } from '@/models/firestoreEventModel';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export function useTravelEventDetailsViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [seatsRequired, setSeatsRequired] = useState('');

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

  const handleJoinEvent = () => {
    // TODO: add handle join event functionality (user story #10)
    console.log('Joining event with seats:', seatsRequired);
  };

  return {
    event,
    seatsRequired,
    setSeatsRequired,
    handleJoinEvent,
  };
}