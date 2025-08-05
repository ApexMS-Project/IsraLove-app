// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA-3GETuGb66OcmUdPOvrnLzHgPDTbhfU0",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "isralove-app-8c6b1.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "isralove-app-8c6b1",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "isralove-app-8c6b1.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "211556765903",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:211556765903:web:bdc806ba44af4ae42c27ba",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-DL2H7C3GSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
