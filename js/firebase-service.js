
import { FIREBASE_ENABLED, firebaseConfig, DEV_AUTH_CONFIG } from './firebase-config.js';
import { familySeedData, generateFlatDatabase } from './family-data.js';

// If Firebase is enabled, these would be populated from the SDK
let app, database, auth;

if (FIREBASE_ENABLED) {
    try {
        // Placeholder for future Firebase SDK imports
        // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
        // import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
        // app = initializeApp(firebaseConfig);
        // database = getDatabase(app);
        console.info("Firebase initialization logic active.");
    } catch (e) {
        console.error("Firebase SDK failed to load. Falling back to local data.", e);
    }
}

/**
 * Service Layer for the Application
 * Resolves whether to use Local Seed Data or Firebase RTDB
 */
export const FamilyService = {
    
    async getStatistics() {
        if (FIREBASE_ENABLED && database) {
            // Future: return await get(ref(database, 'statistics'));
        }
        return familySeedData.stats;
    },

    async getMemorials() {
        if (FIREBASE_ENABLED && database) {
            // Future fetch
        }
        return familySeedData.memorials;
    },

    async getBranches() {
        if (FIREBASE_ENABLED && database) {
            // Future fetch
        }
        return familySeedData.branches.map(b => b.branchName);
    },

    async getFlatDirectory() {
        return generateFlatDatabase(familySeedData);
    },

    async getTreeData() {
        return familySeedData;
    }
};

/**
 * Authentication Service
 */
export const AuthService = {
    async login(username, password) {
        if (DEV_AUTH_CONFIG.enabled) {
            // Local fallback logic requested
            if (username === DEV_AUTH_CONFIG.username && password === DEV_AUTH_CONFIG.password) {
                sessionStorage.setItem("abasaya_auth", "true");
                return { success: true };
            }
            throw new Error("Invalid family credentials.");
        }

        if (FIREBASE_ENABLED && auth) {
            // Future Firebase Auth Logic:
            // return await signInWithEmailAndPassword(auth, username, password);
            return { success: false, error: "Firebase Auth not yet implemented." };
        }

        throw new Error("Authentication service is currently disabled.");
    },

    isAuthenticated() {
        return sessionStorage.getItem("abasaya_auth") === "true";
    },

    logout() {
        sessionStorage.removeItem("abasaya_auth");
        window.location.href = "index.html";
    }
};
