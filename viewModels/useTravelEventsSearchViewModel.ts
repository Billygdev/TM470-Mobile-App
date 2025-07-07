import { getTravelEvents, subscribeToTravelEvents, TravelEvent } from '@/models/firestoreEventModel';
import { travelEventsSearchFilter } from '@/scripts/travelEventsSearchFilter';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function useTravelEventsSearchViewModel() {
  const [events, setEvents] = useState<TravelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getTravelEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching travel events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTravelEvents(setEvents, setLoading);
    return () => unsubscribe();
  }, []);

  const handleEventPress = (event: TravelEvent) => {
    router.push({
      pathname: '/travel-event-details',
      params: { id: event.id },
    });
  };

  const filteredEvents = travelEventsSearchFilter(events, searchQuery);

  return {
    events: filteredEvents,
    loading,
    searchQuery,
    setSearchQuery,
    handleEventPress,
  };
}