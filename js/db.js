
/**
 * REALTIME DATABASE CONTROLLER
 * Strictly enforces data integrity rules. 
 * Prevents deletion, allows updating specific fields (like Image URLs).
 */

import { ref, update, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { db, USE_LIVE_FIREBASE } from './firebase-config.js';
import { familySeedData } from './family-data.js';

export const DBService = {
    /**
     * Fetch all branches/heads of family (Public)
     */
    async getBranches() {
        if (USE_LIVE_FIREBASE) {
            const branchesRef = ref(db, 'branches');
            const snapshot = await get(branchesRef);
            return snapshot.exists() ? snapshot.val() : [];
        }
        return familySeedData.branches;
    },

    /**
     * Get aggregate family statistics (Public)
     */
    async getStats() {
        if (USE_LIVE_FIREBASE) {
            const statsRef = ref(db, 'statistics');
            const snapshot = await get(statsRef);
            return snapshot.exists() ? snapshot.val() : familySeedData.stats;
        }
        return familySeedData.stats;
    },

    /**
     * UPDATE A FAMILY MEMBER (Admin Only)
     * Rule: You cannot delete a member. You can only update specific metadata.
     * @param {string} branchId - The branch the member belongs to
     * @param {string} memberId - Unique ID of the member
     * @param {object} updates - Object containing allowed fields (isAlive, imageUrl, description)
     */
    async updateMemberMetadata(branchId, memberId, updates) {
        // Enforce allowed fields only to prevent accidental destruction of hierarchy
        const allowedUpdates = {};
        
        if (updates.hasOwnProperty('isAlive')) {
            allowedUpdates.isAlive = Boolean(updates.isAlive);
        }
        if (updates.hasOwnProperty('imageUrl') && typeof updates.imageUrl === 'string') {
            // Using URL as requested for RTDB image management
            allowedUpdates.imageUrl = updates.imageUrl;
        }
        if (updates.hasOwnProperty('biography')) {
            allowedUpdates.biography = updates.biography;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            throw new Error("No valid fields provided for update. Deletion/renaming is not allowed via this API.");
        }

        if (USE_LIVE_FIREBASE) {
            const memberRef = ref(db, `branches/${branchId}/descendants/${memberId}`);
            // This merges the allowed fields into the existing node without overwriting omitted data
            await update(memberRef, allowedUpdates);
            console.log(`Member ${memberId} updated successfully via URL/Meta config.`);
        } else {
            console.log("MOCK UPDATE (Firebase Disabled):", { branchId, memberId, allowedUpdates });
        }
    }
};
