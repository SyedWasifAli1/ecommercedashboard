// lib/firebase-config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // For Firebase Authentication
import { getFirestore } from 'firebase/firestore';  // For Firestore database

const firebaseConfig = {
    apiKey: "AIzaSyBeGl5FJE-ZkGeSJ2c_8BZZ67gXdTyLVeI",
    authDomain: "authwithfirebase-20a41.firebaseapp.com",
    databaseURL: "https://authwithfirebase-20a41-default-rtdb.firebaseio.com",
    projectId: "authwithfirebase-20a41",
    storageBucket: "authwithfirebase-20a41.appspot.com",
    messagingSenderId: "513334310836",
    appId: "1:513334310836:web:7090fa61046cd6f1dce4e1",
    measurementId: "G-11T09DTR7V"
};

// Initialize Firebase if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Auth and Firestore instances
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
