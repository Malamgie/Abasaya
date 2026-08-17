
/**
 * FIREBASE INITIALIZATION & CONFIGURATION
 * Modular SDK v10 implementation.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// TODO: Replace this object with your actual Firebase Project Configuration.
// You can find this in your Firebase Console under Project Settings > General > Your apps.
const firebaseConfig = {
    apiKey: "AIzaSyC_HFuy9Z3KfgZa9Ak1gGUYY4fOufald60",
    authDomain: "lara-s-collection.firebaseapp.com",
    databaseURL: "https://lara-s-collection-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lara-s-collection",
    storageBucket: "lara-s-collection.firebasestorage.app",
    messagingSenderId: "430661740479",
    appId: "1:430661740479:web:c44843772e82a08096a30a"
};

// Initialize the main Firebase Application
const app = initializeApp(firebaseConfig);

// Initialize and export Authentication and Realtime Database services
export const auth = getAuth(app);
export const db = getDatabase(app);

/**
 * GLOBAL FEATURE FLAG
 * Set this to `true` ONLY after you have pasted your real Firebase credentials above.
 * When `false`, the UI will gracefully fall back to `js/family-data.js` and block admin login.
 */
export const USE_LIVE_FIREBASE = false;
