/**
 * REALTIME DATABASE CONTROLLER
 * Handles Stats, Branches, Announcements, and Emails safely.
 */

import { ref, get, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { db, USE_LIVE_FIREBASE } from './firebase-config.js';
import { familySeedData } from './family-data.js';

export const DBService = {
    
    // --- PUBLIC DATA FETCHING --- //

    async getStats() {
        try {
            if (USE_LIVE_FIREBASE && db) {
                const statsRef = ref(db, 'statistics');
                const snapshot = await get(statsRef);
                if (snapshot.exists()) {
                    return snapshot.val();
                }
            }
        } catch (error) {
            console.warn("Firebase stats fetch failed, safely falling back to local data.", error);
        }
        // Always fall back to local seed data
        return familySeedData.stats;
    },

    async getBranches() {
        try {
            if (USE_LIVE_FIREBASE && db) {
                const branchesRef = ref(db, 'branches');
                const snapshot = await get(branchesRef);
                if (snapshot.exists()) {
                    return Object.values(snapshot.val());
                }
            }
        } catch (error) {
            console.warn("Firebase branches fetch failed, using local branches.", error);
        }
        return familySeedData.branches;
    },

    // --- ANNOUNCEMENTS & EMAILS --- //

    async registerEmail(fullName, branch, email) {
        if (!USE_LIVE_FIREBASE || !db) {
            console.log("Mock Registration Success:", { fullName, branch, email });
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

    async postAnnouncement(title, body, sendEmail) {
        if (!USE_LIVE_FIREBASE || !db) {
            console.log("Mock Post Announcement:", { title, body, sendEmail });
            return true;
        }

        const announcementsRef = ref(db, 'announcements');
        const newAnnouncementRef = push(announcementsRef);
        
        await set(newAnnouncementRef, {
            title,
            body,
            emailed: sendEmail,
            timestamp: serverTimestamp()
        });

        if (sendEmail) {
            await this.triggerEmailBroadcast(title, body);
        }

        return true;
    },

    async triggerEmailBroadcast(title, bodyHtml) {
        try {
            const subscribersRef = ref(db, 'subscribers');
            const snapshot = await get(subscribersRef);
            
            if (!snapshot.exists()) return;

            const subscribers = Object.values(snapshot.val());
            const mailRef = ref(db, 'mail'); 

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
                                </div>
                            </div>
                        `
                    }
                });
            });

            await Promise.all(promises);
            
        } catch (error) {
            console.error("Failed to queue broadcast emails:", error);
            throw error; 
        }
    },

    async getAnnouncements() {
        if (!USE_LIVE_FIREBASE || !db) {
            return [
                { title: "Welcome to the New Abasaya Heritage Portal", body: "The family administration is proud to launch the official digital archive. Family heads are encouraged to review their branch lineage and prepare historical photographs for the upcoming gallery integration phase.", timestamp: Date.now(), emailed: false }
            ];
        }

        try {
            const announcementsRef = ref(db, 'announcements');
            const snapshot = await get(announcementsRef);
            
            if (!snapshot.exists()) return [];

            const arr = Object.values(snapshot.val());
            return arr.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
            return [];
        }
    }
};
