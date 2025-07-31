import { useBookedEventUpdateListener } from '@/listeners/useBookedEventUpdateListener';

export default function GlobalListeners() {
  useBookedEventUpdateListener();

  return null;
}