import { auth } from '@/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};