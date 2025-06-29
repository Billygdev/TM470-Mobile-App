import { getTravelEvents, TravelEvent } from '@/models/firestoreEventModel';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function useTravelEventsViewModel() {
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

  const handleEventPress = (event: TravelEvent) => {
    router.push({
      pathname: '/travel-event-details',
      params: { id: event.id },
    });
  };

  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.destination.toLowerCase().includes(query) ||
      event.pickupLocation.toLowerCase().includes(query)
    );
  });

  return {
    events: filteredEvents,
    loading,
    searchQuery,
    setSearchQuery,
    handleEventPress,
  };
}