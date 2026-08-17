/**
 * REALTIME DATABASE CONTROLLER
 * Handles Announcements, Newsletter Registration, and triggering Emails.
 */

import { ref, get, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { db, USE_LIVE_FIREBASE } from './firebase-config.js';
import { familySeedData } from './family-data.js';

export const DBService = {
    // ... (Keep existing getBranches and getStats functions here for public pages)
    async getBranches() {
        if (USE_LIVE_FIREBASE) {
            const branchesRef = ref(db, 'branches');
            const snapshot = await get(branchesRef);
            return snapshot.exists() ? Object.values(snapshot.val()) : [];
        }
        return familySeedData.branches;
    },

    async getStats() {
        if (USE_LIVE_FIREBASE) {
            const statsRef = ref(db, 'statistics');
            const snapshot = await get(statsRef);
            return snapshot.exists() ? snapshot.val() : familySeedData.stats;
        }
        return familySeedData.stats;
    },

    /**
     * REGISTER NEWSLETTER EMAIL (Public Landing Page)
     */
    async registerEmail(fullName, branch, email) {
        if (!USE_LIVE_FIREBASE) {
            console.log("Mock Registration:", { fullName, branch, email });
            return true;
        }
        
        const subscribersRef = ref(db, 'subscribers');
        const newSubscriberRef = push(subscribersRef);
        
        await set(newSubscriberRef, {
            fullName,
            branch,
            email,
            registeredAt: serverTimestamp()
        });
        
        return true;
    },

    /**
     * POST ANNOUNCEMENT & TRIGGER EMAILS (Admin Only)
     */
    async postAnnouncement(title, body, sendEmail) {
        if (!USE_LIVE_FIREBASE) {
            console.log("Mock Post Announcement:", { title, body, sendEmail });
            return true;
        }

        // 1. Save the announcement to the public feed
        const announcementsRef = ref(db, 'announcements');
        const newAnnouncementRef = push(announcementsRef);
        
        await set(newAnnouncementRef, {
            title,
            body,
            emailed: sendEmail,
            timestamp: serverTimestamp()
        });

        // 2. If email toggle is checked, queue emails for all subscribers
        if (sendEmail) {
            await this.triggerEmailBroadcast(title, body);
        }

        return true;
    },

    /**
     * INTERNAL: Fetches subscribers and formats them for Firebase Trigger Email Extension
     */
    async triggerEmailBroadcast(title, bodyHtml) {
        try {
            // Fetch all registered subscribers
            const subscribersRef = ref(db, 'subscribers');
            const snapshot = await get(subscribersRef);
            
            if (!snapshot.exists()) return;

            const subscribers = Object.values(snapshot.val());
            const mailRef = ref(db, 'mail'); // The collection the Firebase Extension listens to

            // Create a mail document for each subscriber
            const promises = subscribers.map(sub => {
                if (!sub.email) return Promise.resolve();
                
                const newMail = push(mailRef);
                return set(newMail, {
                    to: sub.email,
                    message: {
                        subject: `Official Announcement: ${title} - Abasaya Family`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eab308; border-radius: 4px; overflow: hidden;">
                                <div style="background-color: #062c22; color: #fdfbf7; padding: 20px; text-align: center;">
                                    <h2 style="margin: 0; font-weight: normal; letter-spacing: 2px;">ABASAYA HERITAGE</h2>
                                </div>
                                <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                                    <h3 style="color: #062c22;">${title}</h3>
                                    <p>Dear ${sub.fullName || 'Family Member'},</p>
                                    <div style="margin-top: 20px; margin-bottom: 20px;">
                                        ${bodyHtml.replace(/\n/g, '<br>')}
                                    </div>
                                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                                    <p style="font-size: 12px; color: #888; text-align: center;">
                                        You are receiving this because you registered on the Abasaya Family Heritage Portal.
                                    </p>
                                </div>
                            </div>
                        `
                    }
                });
            });

            await Promise.all(promises);
            console.log(`Successfully queued ${promises.length} emails to Firebase Mail Extension.`);
            
        } catch (error) {
            console.error("Failed to queue broadcast emails:", error);
            throw error; // Propagate error so admin UI knows the email part failed
        }
    },

    /**
     * FETCH PAST ANNOUNCEMENTS (Admin & Public)
     */
    async getAnnouncements() {
        if (!USE_LIVE_FIREBASE) {
            return [
                { title: "Welcome to the New Abasaya Heritage Portal", body: "...", timestamp: Date.now(), emailed: false }
            ];
        }

        const announcementsRef = ref(db, 'announcements');
        const snapshot = await get(announcementsRef);
        
        if (!snapshot.exists()) return [];

        // Convert object map to array and sort by newest first
        const arr = Object.values(snapshot.val());
        return arr.sort((a, b) => b.timestamp - a.timestamp);
    }
};
