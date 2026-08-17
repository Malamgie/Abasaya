/**
 * PUBLIC UI LOGIC
 * Handles Landing Page Animations and Stats Fetching safely on Mobile & Desktop
 */

import { DBService } from './db.js';

// Ensure the scripts run regardless of how the module was loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    initScrollAnimations();
    initStatistics();
}

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

function initStatistics() {
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length === 0) return;

    let hasAnimated = false;
    
    // Mobile Fix: We use threshold 0.1 and observe the cards directly.
    // This ensures it triggers even on small phone screens where the section is tall.
    const observer = new IntersectionObserver(async (entries) => {
        // If any of the stat cards come into view
        const isIntersecting = entries.some(entry => entry.isIntersecting);
        
        if (isIntersecting && !hasAnimated) {
            hasAnimated = true; // Ensure it only fetches and animates once
            
            try {
                // Fetch the stats securely from DB Service
                const stats = await DBService.getStats();
                
                counters.forEach(counter => {
                    const key = counter.getAttribute('data-stat');
                    // Parse integer safely
                    const endValue = parseInt(stats[key], 10);
                    
                    if (!isNaN(endValue)) {
                        animateValue(counter, 0, endValue, 2500); // 2.5s duration
                    }
                });
            } catch (e) {
                console.error("Failed to load family statistics", e);
            }
        }
    }, { threshold: 0.1 });

    // Observe each counter card directly instead of the parent wrapper
    counters.forEach(counter => observer.observe(counter));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutQuart curve for a smooth, cinematic slowdown at the end
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end; // Ensure exact final value is set
        }
    };
    window.requestAnimationFrame(step);
}
