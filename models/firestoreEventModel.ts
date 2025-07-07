import { firestore } from '@/services/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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

  return snapshot.docs.map(doc => {
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    };
  }) as TravelEvent[];
};

// SUBSCRIBE TO ALL TRAVEL EVENTS (FOR LIVE UPDATES)
export const subscribeToTravelEvents = (
  callback: (events: TravelEvent[]) => void,
  setLoading?: (val: boolean) => void
): (() => void) => {
  const colRef = collection(firestore, 'travelEvents');
  const q = query(colRef, orderBy('pickupDate'));

  if (setLoading) setLoading(true);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const events: TravelEvent[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        destination: data.destination,
        pickupLocation: data.pickupLocation,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        seatsAvailable: data.seatsAvailable,
        seatsBooked: data.seatsBooked ?? 0,
        requirePayment: data.requirePayment,
        organizerName: data.organizerName,
        organizerUid: data.organizerUid,
        createdAt: data.createdAt,
      };
    });

    callback(events);

    if (setLoading) setLoading(false);
  });

  return unsubscribe;
};

// GET ONE TRAVEL EVENT
export const getTravelEventById = async (id: string): Promise<TravelEvent> => {
  const docRef = doc(firestore, 'travelEvents', id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error('Travel event not found');
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
  } as TravelEvent;
};

// SUBSCRIBE TO ONE TRAVEL EVENT (FOR LIVE UPDATES)
export const subscribeToTravelEventById = (
  id: string,
  callback: (event: TravelEvent | null) => void
): (() => void) => {
  const docRef = doc(firestore, 'travelEvents', id);

  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    const data = snapshot.data();

    const event: TravelEvent = {
      id: snapshot.id,
      title: data.title,
      destination: data.destination,
      pickupLocation: data.pickupLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      price: typeof data.price === 'string' ? Number(data.price) : data.price,
      seatsAvailable: data.seatsAvailable,
      seatsBooked: data.seatsBooked ?? 0,
      requirePayment: data.requirePayment,
      organizerName: data.organizerName,
      organizerUid: data.organizerUid,
      createdAt: data.createdAt,
    };

    callback(event);
  });
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

  const currentData = eventSnap.data();
  const currentSeatsBooked = currentData.seatsBooked || 0;
  const totalSeatsAvailable = currentData.seatsAvailable;

  const newTotal = currentSeatsBooked + booking.seatsBooked;

  // Validation to prevent overbooking
  if (newTotal > totalSeatsAvailable) {
    throw new Error(
      `Only ${totalSeatsAvailable - currentSeatsBooked} seat(s) remaining.`
    );
  }

  // 1. Update the parent travel event's seatsBooked field
  await updateDoc(eventRef, {
    seatsBooked: newTotal,
  });

  // 2. Add new booking document to 'bookings' subcollection
  const bookingsColRef = collection(eventRef, 'bookings');
  await addDoc(bookingsColRef, {
    ...booking,
    createdAt: serverTimestamp(),
  });
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