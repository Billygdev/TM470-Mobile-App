import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { firestore } from '@/services/firebase';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useRef } from 'react';

// This listener listens for event updates on events the logged in user is booked on to.
// It uses the browsers local storage to prevent duplicate notifications.

export const useBookedEventUpdateListener = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const unsubscribers = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchAndListen = async () => {
      const travelEventsSnap = await getDocs(collection(firestore, 'travelEvents'));

      const bookedEventIds: string[] = [];

      for (const travelEventDoc of travelEventsSnap.docs) {
        const travelEventId = travelEventDoc.id;
        const bookingsRef = collection(firestore, 'travelEvents', travelEventId, 'bookings');

        const bookingSnap = await getDocs(
          query(bookingsRef, where('bookerUid', '==', user.uid))
        );

        if (!bookingSnap.empty) {
          bookedEventIds.push(travelEventId);
        }
      }

      bookedEventIds.forEach((eventId) => {
        const unsub = onSnapshot(doc(firestore, 'travelEvents', eventId), (snap) => {
          const data = snap.data();
          
          if (!data?.updatedAt) return;

          const updatedMillis = data.updatedAt.toMillis?.() ?? data.updatedAt.seconds * 1000;
          const lastSeenKey = `lastSeenUpdate_${eventId}`;
          const lastSeen = Number(localStorage.getItem(lastSeenKey));

          if (!lastSeen || updatedMillis > lastSeen) {
            addNotification({
              title: 'Travel Event Updated',
              body: `"${data.title}" has been updated.`,
              timestamp: updatedMillis,
            });

            localStorage.setItem(lastSeenKey, String(updatedMillis));
          }
        });

        unsubscribers.current.push(unsub);
      });
    };

    fetchAndListen();

    return () => {
      unsubscribers.current.forEach((unsub) => unsub());
      unsubscribers.current = [];
    };
  }, [user, addNotification]);
};
