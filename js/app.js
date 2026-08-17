
import { FamilyService } from './firebase-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Animated Counters for Statistics on the Homepage
    const statCounters = document.querySelectorAll('.stat-counter');
    if (statCounters.length > 0) {
        try {
            const stats = await FamilyService.getStatistics();
            
            // Map the DOM elements to the data keys
            const mapKeys = {
                'totalMembers': stats.totalMembers,
                'male': stats.male,
                'female': stats.female,
                'children': stats.children,
                'grandchildren': stats.grandchildren,
                'greatGrandchildren': stats.greatGrandchildren
            };

            statCounters.forEach(counter => {
                const statKey = counter.dataset.stat;
                const targetVal = mapKeys[statKey];
                if (targetVal !== undefined) {
                    animateValue(counter, 0, targetVal, 1500);
                }
            });
        } catch (e) {
            console.error("Failed to load statistics", e);
        }
    }

    // Initialize Image Placeholders global fallback
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E";
        });
    });
});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
