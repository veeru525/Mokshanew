// Firebase configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDNmel9fjIG2F_awLlXRZRIRA5H7G1Pzk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "moksha-d9484.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "moksha-d9484",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "moksha-d9484.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "288394673081",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:288394673081:web:6263cb50c7266bb4351468"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
