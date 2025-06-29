import { getTravelEvents } from '@/models/firestoreEventModel';
import { useEffect, useState } from 'react';

export type TravelEvent = {
  id: string;
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: number;
};

export function useTravelEventsViewModel() {
  const [events, setEvents] = useState<TravelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await getTravelEvents();
        setEvents(data as TravelEvent[]);
      } catch (error) {
        console.error('Error fetching travel events:', error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.destination.toLowerCase().includes(query) ||
      event.pickupLocation.toLowerCase().includes(query)
    );
  });

  return { events: filteredEvents, loading, searchQuery, setSearchQuery };
}