
/**
 * Abasaya Family Heritage - Firebase Configuration
 * 
 * INSTRUCTIONS:
 * 1. Change FIREBASE_ENABLED to true when you have inserted your real credentials.
 * 2. Replace the placeholder values in `firebaseConfig` with your real Firebase Project keys.
 * 3. Once Firebase Auth is active, set DEV_AUTH_CONFIG.enabled to false.
 */

export const FIREBASE_ENABLED = false;

// 🔴 PASTE YOUR FIREBASE CONFIGURATION HERE 🔴
export const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
};

// Local Development / Initial Authentication Fallback
export const DEV_AUTH_CONFIG = {
    enabled: true, // MUST BE FALSE IN PRODUCTION ONCE FIREBASE IS CONNECTED
    username: "Abasaya",
    password: "000940"
};

export const IMAGE_PLACEHOLDERS = {
    hero: "assets/images/hero-family-placeholder.jpg",
    ancestor: "assets/images/late-musa-ibrahim-placeholder.jpg",
    memorial: "assets/images/memorial-placeholder.jpg",
    achievement: "assets/images/achievement-placeholder.jpg",
    gallery: "assets/images/gallery-placeholder.jpg",
    event: "assets/images/event-placeholder.jpg"
};
