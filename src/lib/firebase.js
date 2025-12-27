import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBm0GQiG5PEXToqlTmUTz71dTt3cJKTVTY",
  authDomain: "code-editor-6d459.firebaseapp.com",
  projectId: "code-editor-6d459",
  storageBucket: "code-editor-6d459.appspot.com",
  messagingSenderId: "790109384425",
  appId: "1:790109384425:web:a38b04d2b74ce671d50a78",
  measurementId: "G-SV9DPVS83N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); // ✅ export app

// Realtime Database setup
export const database = getDatabase(app);

// Optional: Analytics
if (typeof window !== 'undefined') {
  getAnalytics(app);
}
