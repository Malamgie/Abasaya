/**
 * FIREBASE INITIALIZATION & CONFIGURATION
 * Modular SDK v10 implementation.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// TODO: Replace with your actual Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_HFuy9Z3KfgZa9Ak1gGUYY4fOufald60",
  authDomain: "lara-s-collection.firebaseapp.com",
  databaseURL: "https://lara-s-collection-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lara-s-collection",
  storageBucket: "lara-s-collection.firebasestorage.app",
  messagingSenderId: "430661740479",
  appId: "1:430661740479:web:c44843772e82a08096a30a",
  measurementId: "G-7CT7X08CR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Global feature flag to switch between mock data and live DB during development
export const USE_LIVE_FIREBASE = false;
