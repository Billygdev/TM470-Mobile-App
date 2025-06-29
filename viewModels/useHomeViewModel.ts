import { useAuth } from '@/contexts/AuthContext';
import { getRecentNews, NewsArticle } from '@/models/firestoreNewsModel';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function useHomeViewModel() {
  const { user } = useAuth();
  const router = useRouter();

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const displayName = user?.displayName ?? 'User';

  const navigateToCreateEvent = () => {
    router.push('/create-event');
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        const articles = await getRecentNews();
        setNews(articles);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    loadNews();
  }, []);

  return {
    displayName,
    navigateToCreateEvent,
    news,
    loadingNews,
  };
}