import { firestore } from '@/services/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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