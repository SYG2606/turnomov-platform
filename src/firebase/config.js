// src/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD5BVLXg7XUYm_B6cyv3hRIoYow1W0wWYg",
  authDomain: "turnos-bikes-app-98635.firebaseapp.com",
  projectId: "turnos-bikes-app-98635",
  storageBucket: "turnos-bikes-app-98635.firebasestorage.app",
  messagingSenderId: "93838557270",
  appId: "mi-taller-bici",
};

// Singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔴 FIX CRÍTICO
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Auth
const auth = getAuth(app);

export { db, auth, app };
