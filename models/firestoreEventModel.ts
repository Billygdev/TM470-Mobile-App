import { firestore } from '@/services/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

export interface TravelEvent {
  id?: string;
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: number;
  requirePayment: boolean;
  organizerName: string;
  organizerUid: string;
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