import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDlk9MJZok7Gqn8OAT0dIqbBwDI0rBj1Jo",
  authDomain: "sport-sync-db532.firebaseapp.com",
  projectId: "sport-sync-db532",
  storageBucket: "sport-sync-db532.appspot.com",
  messagingSenderId: "600407801318",
  appId: "1:600407801318:web:43b166e2060da358742a27",
  measurementId: "G-1HZPD3GM02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

