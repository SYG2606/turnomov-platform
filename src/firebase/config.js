// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5BVLXg7XUYm_B6cyv3hRIoYow1W0wWYg",
  authDomain: "turnos-bikes-app-98635.firebaseapp.com",
  projectId: "turnos-bikes-app-98635",
  storageBucket: "turnos-bikes-app-98635.firebasestorage.app",
  messagingSenderId: "93838557270",
  appId: "1:93838557270:web:12bf555e73544987c9bbf7",
};

// Inicialización
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;