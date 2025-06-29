import { firestore } from '@/services/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  date: any;
};

export const getRecentNews = async (): Promise<NewsArticle[]> => {
  const colRef = collection(firestore, 'news');
  const q = query(colRef, orderBy('date', 'desc'), limit(5));

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsArticle[];
};