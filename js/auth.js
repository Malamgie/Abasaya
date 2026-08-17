/**
 * REAL FIREBASE AUTHENTICATION CONTROLLER
 * Handles Admin login, logout, and session state.
 */

import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth, USE_LIVE_FIREBASE } from './firebase-config.js';

export const AuthService = {
    /**
     * Authenticate an Admin User using Firebase Auth
     */
    async login(email, password) {
        if (!USE_LIVE_FIREBASE) {
            throw new Error("System Error: Firebase is not enabled in firebase-config.js. Cannot authenticate.");
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Firebase Auth Failed:", error.code, error.message);
            // Translate common Firebase errors into user-friendly messages
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                throw new Error("Invalid admin credentials. Please try again.");
            }
            if (error.code === 'auth/too-many-requests') {
                throw new Error("Too many failed attempts. Please try again later.");
            }
            throw new Error("Authentication failed. Please check your connection.");
        }
    },

    /**
     * Sign out current Admin
     */
    async logout() {
        if (USE_LIVE_FIREBASE) {
            await signOut(auth);
        }
        window.location.href = "portal.html";
    },

    /**
     * Listen for auth state changes (used to protect admin routes)
     */
    onStateChange(callback) {
        if (USE_LIVE_FIREBASE) {
            onAuthStateChanged(auth, callback);
        } else {
            // If Firebase is off, immediately return null (unauthenticated)
            callback(null);
        }
    }
};
