import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPfUb90VEtgcTaBrjBbsZC5aoVFmbExM0",
  authDomain: "devprep-970a5.firebaseapp.com",
  projectId: "devprep-970a5",
  storageBucket: "devprep-970a5.firebasestorage.app",
  messagingSenderId: "828325472536",
  appId: "1:828325472536:web:b7727f4494a2a95accd66d",
  measurementId: "G-G30TMNYWEF"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);