/**
 * PUBLIC UI LOGIC
 * Handles Landing Page Animations and Stats Fetching
 */

import { DBService } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    initScrollAnimations();
    await initStatistics();
});

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
    
    // Trigger on load for elements already in viewport (like Hero)
    setTimeout(() => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
}

async function initStatistics() {
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length === 0) return;

    try {
        const stats = await DBService.getStats();
        
        counters.forEach(counter => {
            const key = counter.getAttribute('data-stat');
            if (stats[key] !== undefined) {
                animateValue(counter, 0, stats[key], 2000);
            }
        });
    } catch (e) {
        console.error("Failed to load family statistics", e);
    }
}

// Cinematic number counter animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart curve
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end; // Ensure exact final value
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize the main Firebase Application
const app = initializeApp(firebaseConfig);

// Initialize and export Authentication and Realtime Database services
let auth, db;
try {
    auth = getAuth(app);
    // Only initialize DB if URL is somewhat valid, otherwise Firebase throws a fatal module error
    if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes('YOUR_DATABASE')) {
        db = getDatabase(app);
    }
} catch (e) {
    console.warn("Firebase services not fully initialized. Using local seed data.", e.message);
}

export { auth, db };

