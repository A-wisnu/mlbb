// Import Firebase
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Konfigurasi Firebase dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDxM20JqSX3BHM0S7uc6Tq1R-yGlC6MKa4",
  authDomain: "mlbb-1b2ee.firebaseapp.com",
  projectId: "mlbb-1b2ee",
  storageBucket: "mlbb-1b2ee.appspot.com",
  messagingSenderId: "528528561834",
  appId: "1:528528561834:web:9d5d6efec8690bf0b5e2d3",
  measurementId: "G-RG4RC806HP"
};

// Inisialisasi Firebase
// Pastikan aplikasi hanya diinisialisasi sekali
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Gunakan instance yang sudah ada
}

const db = getFirestore(app);
const auth = getAuth(app);

// Aktifkan emulator hanya jika ada flag FIREBASE_USE_EMULATOR yang diset
// dan hanya jika aplikasi berjalan di browser (client-side)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true') {
  try {
    // Pastikan emulator berjalan di port yang benar (biasanya 8080)
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Opsional: Juga hubungkan Auth emulator jika diperlukan
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Failed to connect to Firebase emulators:', error);
  }
}

// Analytics hanya berfungsi di browser
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
}

export { db, app, auth, analytics }; 