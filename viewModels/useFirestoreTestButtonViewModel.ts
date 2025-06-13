import {
  createCounterDoc,
  getCounterDoc,
  incrementCounter,
} from '@/models/firestoreTestModel';
import { useState } from 'react';

export const useFirestoreTestButtonViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number | null>(null);

  const handlePress = async () => {
    setLoading(true);
    try {
      const docSnap = await getCounterDoc();
      if (!docSnap.exists()) {
        await createCounterDoc();
        setValue(1);
      } else {
        const data = docSnap.data();
        const current = data?.number ?? 0;
        await incrementCounter(current);
        setValue(current + 1);
      }
    } catch (error) {
      console.error('Error updating Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, value, handlePress };
};
