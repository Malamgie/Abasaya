
/**
 * AUTHENTICATION CONTROLLER
 * Handles Admin login, logout, and session state.
 */

import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth, USE_LIVE_FIREBASE } from './firebase-config.js';

export const AuthService = {
    /**
     * Authenticate an Admin User
     */
    async login(email, password) {
        if (!USE_LIVE_FIREBASE) {
            console.warn("Firebase is disabled. Using local mock login.");
            if (email === "admin@abasaya.family" && password === "000940") {
                sessionStorage.setItem("mock_admin", "true");
                return { uid: "mock_admin_123", email: email };
            }
            throw new Error("Invalid mock credentials.");
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Login Failed:", error.message);
            throw error;
        }
    },

    /**
     * Sign out current Admin
     */
    async logout() {
        if (!USE_LIVE_FIREBASE) {
            sessionStorage.removeItem("mock_admin");
            window.location.href = "index.html";
            return;
        }
        await signOut(auth);
        window.location.href = "index.html";
    },

    /**
     * Listen for auth state changes (used to protect admin routes)
     */
    onStateChange(callback) {
        if (!USE_LIVE_FIREBASE) {
            const isMockAdmin = sessionStorage.getItem("mock_admin") === "true";
            callback(isMockAdmin ? { uid: "mock_admin", email: "admin@abasaya.family" } : null);
            return;
        }
        onAuthStateChanged(auth, callback);
    }
};
