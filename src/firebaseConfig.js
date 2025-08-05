// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-3GETuGb66OcmUdPOvrnLzHgPDTbhfU0",
  authDomain: "isralove-app-8c6b1.firebaseapp.com",
  projectId: "isralove-app-8c6b1",
  storageBucket: "isralove-app-8c6b1.firebasestorage.app",
  messagingSenderId: "211556765903",
  appId: "1:211556765903:web:bdc806ba44af4ae42c27ba",
  measurementId: "G-DL2H7C3GSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
