import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsEOEiUBQEp9CGObKd8mho2bvDHNyY-P0",
  authDomain: "tm470-mobile-app.firebaseapp.com",
  projectId: "tm470-mobile-app",
  storageBucket: "tm470-mobile-app.firebasestorage.app",
  messagingSenderId: "403095713117",
  appId: "1:403095713117:web:96772ab21fcc05ebcb64b4",
  measurementId: "G-BX7KPN5L16"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
