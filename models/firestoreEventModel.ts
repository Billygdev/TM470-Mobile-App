import { firestore } from '@/services/firebase';
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

export interface TravelEvent {
  id?: string;
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: number;
  seatsAvailable: number;
  seatsBooked?: number;
  requirePayment: boolean;
  organizerName: string;
  organizerUid: string;
  createdAt?: any;
}

export interface TravelEventBooking {
  id?: string;
  seatsBooked: number;
  payed: boolean;
  bookerName: string;
  bookerUid: string;
  createdAt?: any;
}

export interface UserBookingWithEvent {
  bookingId: string;
  eventId: string;
  booking: TravelEventBooking;
  event: TravelEvent;
}

// CREATE TRAVEL EVENT
export const createTravelEvent = async (
  data: Omit<TravelEvent, 'id' | 'createdAt'>
) => {
  const colRef = collection(firestore, 'travelEvents');

  await addDoc(colRef, {
    ...data,
    price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    createdAt: serverTimestamp(),
  });
};

// UPDATE TRAVEL EVENT
export async function updateTravelEvent(eventId: string, data: Partial<any>) {
  const colRef = doc(firestore, 'travelEvents', eventId);

  await updateDoc(colRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// GET ALL TRAVEL EVENTS
export const getTravelEvents = async (): Promise<TravelEvent[]> => {
  const colRef = collection(firestore, 'travelEvents');
  const q = query(colRef, orderBy('pickupDate'));

  const snapshot = await getDocs(q);

  const events: TravelEvent[] = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const seatsBooked = await getSeatsBookedForEvent(id);

      return {
        id,
        ...data,
        seatsBooked,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      } as TravelEvent;
    })
  );

  return events;
};

// SUBSCRIBE TO ALL TRAVEL EVENTS (FOR LIVE UPDATES)
export const subscribeToTravelEvents = (
  callback: (events: TravelEvent[]) => void,
  setLoading?: (val: boolean) => void
): (() => void) => {
  const colRef = collection(firestore, 'travelEvents');
  const q = query(colRef, orderBy('pickupDate'));

  let eventDocsMap = new Map<string, TravelEvent>();
  let bookingUnsubsMap = new Map<string, () => void>();

  if (setLoading) setLoading(true);

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    // Unsubscribe old bookings listeners
    bookingUnsubsMap.forEach(unsub => unsub());
    bookingUnsubsMap.clear();
    eventDocsMap.clear();

    const newEventList: TravelEvent[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const eventId = docSnap.id;

      const event: TravelEvent = {
        id: eventId,
        title: data.title,
        destination: data.destination,
        pickupLocation: data.pickupLocation,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        seatsAvailable: data.seatsAvailable,
        requirePayment: data.requirePayment,
        organizerName: data.organizerName,
        organizerUid: data.organizerUid,
        createdAt: data.createdAt,
        seatsBooked: 0, // placeholder until booking snapshot comes in
      };

      eventDocsMap.set(eventId, event);
      newEventList.push(event);

      // Subscribe to each bookings subcollection
      const bookingsRef = collection(firestore, 'travelEvents', eventId, 'bookings');
      const bookingsUnsub = onSnapshot(bookingsRef, (bookingSnap) => {
        const seatsBooked = bookingSnap.docs.reduce((total, doc) => {
          const booking = doc.data() as TravelEventBooking;
          return total + (booking.seatsBooked || 0);
        }, 0);

        const updated = { ...eventDocsMap.get(eventId)!, seatsBooked };
        eventDocsMap.set(eventId, updated);

        callback(Array.from(eventDocsMap.values()));
      });

      bookingUnsubsMap.set(eventId, bookingsUnsub);
    }

    // Initial callback
    callback(newEventList);
    if (setLoading) setLoading(false);
  });

  return () => {
    unsubscribe();
    bookingUnsubsMap.forEach(unsub => unsub());
  };
};

// GET ONE TRAVEL EVENT
export const getTravelEventById = async (id: string): Promise<TravelEvent> => {
  const docRef = doc(firestore, 'travelEvents', id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error('Travel event not found');
  }

  const data = snapshot.data();

  const seatsBooked = await getSeatsBookedForEvent(id);

  return {
    id: snapshot.id,
    ...data,
    seatsBooked,
    price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
  } as TravelEvent;
};

// SUBSCRIBE TO ONE TRAVEL EVENT (FOR LIVE UPDATES)
export const subscribeToTravelEventById = (
  id: string,
  callback: (event: TravelEvent | null) => void
): (() => void) => {
  const docRef = doc(firestore, 'travelEvents', id);
  const bookingsRef = collection(firestore, 'travelEvents', id, 'bookings');

  let latestEventData: Omit<TravelEvent, 'seatsBooked'> | null = null;
  let latestSeatsBooked = 0;

  const emit = () => {
    if (!latestEventData) return;
    callback({
      ...latestEventData,
      id,
      seatsBooked: latestSeatsBooked,
    });
  };

  const unsubscribeEvent = onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    const data = snapshot.data();

    latestEventData = {
      title: data.title,
      destination: data.destination,
      pickupLocation: data.pickupLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      price: typeof data.price === 'string' ? Number(data.price) : data.price,
      seatsAvailable: data.seatsAvailable,
      requirePayment: data.requirePayment,
      organizerName: data.organizerName,
      organizerUid: data.organizerUid,
      createdAt: data.createdAt,
    };

    emit();
  });

  const unsubscribeBookings = onSnapshot(bookingsRef, (snapshot) => {
    latestSeatsBooked = snapshot.docs.reduce((total, doc) => {
      const booking = doc.data() as TravelEventBooking;
      return total + (booking.seatsBooked || 0);
    }, 0);

    emit();
  });

  return () => {
    unsubscribeEvent();
    unsubscribeBookings();
  };
};

// BOOK ONTO TRAVEL EVENT
export const createTravelEventBooking = async (
  eventId: string,
  booking: Omit<TravelEventBooking, 'id' | 'createdAt'>
): Promise<void> => {
  const eventRef = doc(firestore, 'travelEvents', eventId);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    throw new Error('Travel event not found');
  }

  const eventData = eventSnap.data();
  const totalSeatsAvailable = eventData.seatsAvailable;

  const currentSeatsBooked = await getSeatsBookedForEvent(eventId);
  const newTotal = currentSeatsBooked + booking.seatsBooked;

  if (newTotal > totalSeatsAvailable) {
    throw new Error(
      `Only ${totalSeatsAvailable - currentSeatsBooked} seat(s) remaining.`
    );
  }

  const bookingsRef = collection(eventRef, 'bookings');
  await addDoc(bookingsRef, {
    ...booking,
    createdAt: serverTimestamp(),
  });
};

// UPDATE TRAVEL EVENT BOOKING
export const updateTravelEventBooking = async (
  eventId: string,
  bookingId: string,
  payed: boolean
): Promise<void> => {
  const bookingRef = doc(firestore, 'travelEvents', eventId, 'bookings', bookingId);
  const bookingSnap = await getDoc(bookingRef);

  if (!bookingSnap.exists()) {
    throw new Error('Booking not found');
  }

  await updateDoc(bookingRef, { payed });
};

// GET TRAVEL EVENT SEATS BOOKED AMOUNT
export const getSeatsBookedForEvent = async (eventId: string): Promise<number> => {
  const bookingsRef = collection(firestore, 'travelEvents', eventId, 'bookings');
  const bookingsSnap = await getDocs(bookingsRef);

  let totalSeats = 0;

  bookingsSnap.forEach(docSnap => {
    const data = docSnap.data() as TravelEventBooking;
    totalSeats += data.seatsBooked;
  });

  return totalSeats;
};

// GET TRAVEL EVENT BOOKINGS
export const getTravelEventBookings = async (eventId: string) => {
  const eventRef = doc(firestore, 'travelEvents', eventId);
  const bookingsRef = collection(eventRef, 'bookings');
  const bookingsSnap = await getDocs(bookingsRef);

  return bookingsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// GET SPECIFIC USER'S TRAVEL EVENT BOOKINGS
export const getUserTravelEventBookings = async (
  userUid: string
): Promise<UserBookingWithEvent[]> => {
  const bookingsQuery = query(
    collectionGroup(firestore, 'bookings'),
    where('bookerUid', '==', userUid)
  );

  const bookingsSnap = await getDocs(bookingsQuery);

  const userBookingsWithEvents: UserBookingWithEvent[] = [];

  for (const docSnap of bookingsSnap.docs) {
    const bookingData = docSnap.data() as TravelEventBooking;
    const bookingId = docSnap.id;

    const eventRef = docSnap.ref.parent.parent;
    if (!eventRef) continue;

    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) continue;

    const eventData = eventSnap.data() as TravelEvent;
    const eventId = eventSnap.id;

    userBookingsWithEvents.push({
      bookingId,
      eventId,
      booking: {
        id: bookingId,
        ...bookingData,
      },
      event: {
        id: eventId,
        ...eventData,
      },
    });
  }

  return userBookingsWithEvents;
};

// SUBSCRIBE TO USERS TRAVEL EVENT BOOKINGS (FOR LIVE UPDATES)
export const subscribeToUserTravelEventBookings = (
  userUid: string,
  callback: (bookings: UserBookingWithEvent[]) => void
): (() => void) => {
  const bookingsQuery = query(
    collectionGroup(firestore, 'bookings'),
    where('bookerUid', '==', userUid)
  );

  const unsubscribe = onSnapshot(bookingsQuery, async (snapshot) => {
    const results: UserBookingWithEvent[] = [];

    for (const docSnap of snapshot.docs) {
      const bookingData = docSnap.data() as TravelEventBooking;
      const bookingId = docSnap.id;

      const eventRef = docSnap.ref.parent.parent;
      if (!eventRef) continue;

      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) continue;

      const eventData = eventSnap.data() as TravelEvent;
      const eventId = eventSnap.id;

      const seatsBooked = await getSeatsBookedForEvent(eventId);

      results.push({
        bookingId,
        eventId,
        booking: {
          id: bookingId,
          ...bookingData,
        },
        event: {
          id: eventId,
          ...eventData,
          seatsBooked,
        },
      });
    }

    callback(results);
  });

  return unsubscribe;
};