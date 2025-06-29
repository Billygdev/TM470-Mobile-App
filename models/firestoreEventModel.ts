import { firestore } from '@/services/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';

export interface TravelEventData {
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: string;
  requirePayment: boolean;
  organizerName: string;
  organizerUid: string;
  createdAt?: any;
}

export const createTravelEvent = async (
    data: Omit<TravelEventData, 'createdAt'>
) => {
  const colRef = collection(firestore, 'travelEvents');

  await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getTravelEvents = async () => {
  const colRef = collection(firestore, 'travelEvents');
  const q = query(colRef, orderBy('pickupDate'));
  
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
};