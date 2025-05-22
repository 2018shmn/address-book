import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAr73mSGTiQKQ4QjlJ1AvQP-aT3cBlkHrI",
  authDomain: "inventory-management-c47cc.firebaseapp.com",
  projectId: "inventory-management-c47cc",
  storageBucket: "inventory-management-c47cc.appspot.com",
  messagingSenderId: "828515117493",
  appId: "1:828515117493:web:59e70f151aa325881291fc",
  measurementId: "G-QP36V9M7CV"
};

const app = typeof window !== "undefined" ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

export {auth, db, storage};
