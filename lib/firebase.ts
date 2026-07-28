import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2Dc27s6eP-BP4XPHayYFmTKgm1BOCPN4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "herocurso.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "herocurso",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "herocurso.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "231831672189",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:231831672189:web:6477dce95929d6b4ada814",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SFBE3H1TJ5",
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || "(default)"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable local persistence
setPersistence(auth, browserLocalPersistence);
export const googleProvider = new GoogleAuthProvider();
