import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export function useHomeViewModel() {
  const { user } = useAuth();
  const router = useRouter();

  const displayName = user?.displayName ?? 'User';

  const navigateToCreateEvent = () => {
    router.push('/create-event');
  };

  return {
    displayName,
    navigateToCreateEvent,
  };
}