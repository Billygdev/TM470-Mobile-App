import { firestore } from '@/services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const COLLECTION = 'firestoreTest';
const DOC_ID = 'counter';

export const getCounterDoc = async () => {
  const docRef = doc(firestore, COLLECTION, DOC_ID);
  const snapshot = await getDoc(docRef);
  return snapshot;
};

export const createCounterDoc = async () => {
  const docRef = doc(firestore, COLLECTION, DOC_ID);
  await setDoc(docRef, { number: 1 });
};

export const incrementCounter = async (current: number) => {
  const docRef = doc(firestore, COLLECTION, DOC_ID);
  await updateDoc(docRef, { number: current + 1 });
};
