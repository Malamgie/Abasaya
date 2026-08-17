/**
 * UI Components (Web Components)
 * Maintains layout consistency across SPAs.
 */

class AppHeader extends HTMLElement {
    connectedCallback() {
        const isScrolled = window.scrollY > 50;
        const currentPath = window.location.pathname;
        
        this.innerHTML = `
            <header class="fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-forest-900/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'} border-b border-gold-500/10" id="main-header">
                <div class="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <!-- Brand -->
                    <a href="index.html" class="flex flex-col">
                        <span class="font-serif text-2xl tracking-wide text-parchment leading-none">ABASAYA</span>
                        <span class="text-[0.55rem] uppercase tracking-[0.25em] text-gold-500 mt-1 font-sans">Family Heritage</span>
                    </a>
                    
                    <!-- Desktop Nav -->
                    <nav class="hidden md:flex items-center gap-8">
                        <a href="index.html" class="text-xs font-medium uppercase tracking-widest ${currentPath.includes('index') || currentPath === '/' ? 'text-gold-500' : 'text-gray-300 hover:text-parchment'} transition-colors">Home</a>
                        <a href="discover.html" class="text-xs font-medium uppercase tracking-widest ${currentPath.includes('discover') ? 'text-gold-500' : 'text-gray-300 hover:text-parchment'} transition-colors">Discover Lineage</a>
                    </nav>

                    <!-- Auth/Admin CTA -->
                    <div class="hidden md:flex items-center">
                        <a href="admin.html" class="text-xs font-semibold uppercase tracking-widest text-parchment border border-parchment/30 px-5 py-2 rounded-sm hover:bg-parchment hover:text-forest-900 transition-colors flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Admin Portal
                        </a>
                    </div>
                </div>
            </header>
        `;

        // Handle scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            if (window.scrollY > 50) {
                header.classList.add('bg-forest-900/95', 'backdrop-blur-md', 'shadow-lg', 'py-4');
                header.classList.remove('bg-transparent', 'py-6');
            } else {
                header.classList.remove('bg-forest-900/95', 'backdrop-blur-md', 'shadow-lg', 'py-4');
                header.classList.add('bg-transparent', 'py-6');
            }
        });
    }
}

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-charcoal text-parchment pt-20 pb-10 border-t border-gold-500/20">
                <div class="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div>
                        <span class="font-serif text-3xl tracking-wide text-parchment block mb-2">Abasaya</span>
                        <span class="text-sm uppercase tracking-[0.2em] text-gold-500 block mb-6">Family Heritage</span>
                        <p class="text-gray-400 text-sm font-light leading-relaxed max-w-sm">
                            An eternal testament to the legacy, people, and stories that bind us together.
                        </p>
                    </div>
                    <div>
                        <h4 class="text-xs uppercase tracking-[0.15em] text-gold-500 mb-6 font-semibold">Navigation</h4>
                        <ul class="space-y-3 text-sm text-gray-400 font-light">
                            <li><a href="index.html" class="hover:text-parchment transition">Home</a></li>
                            <li><a href="discover.html" class="hover:text-parchment transition">Discover Heads of Family</a></li>
                            <li><a href="admin.html" class="hover:text-parchment transition">Secure Admin Access</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xs uppercase tracking-[0.15em] text-gold-500 mb-6 font-semibold">Administrative Office</h4>
                        <p class="text-gray-400 text-sm font-light leading-relaxed mb-4">
                            Modifications to the family structure are strictly reserved for verified family administrators.
                        </p>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light uppercase tracking-wider">
                    <p>&copy; 2026 Abasaya Family Heritage.</p>
                    <p class="flex items-center gap-2">Built with love for generations to come <span class="w-1 h-1 rounded-full bg-gold-500"></span></p>
                </div>
            </footer>
        `;
    }
}

class AchievementCard extends HTMLElement {
    connectedCallback() {
        const imageSrc = this.getAttribute('image-src') || 'https://placehold.co/600x400/062c22/d4af37?text=Milestone';
        const category = this.getAttribute('category') || 'Milestone';
        const title = this.getAttribute('title') || 'Achievement Title';
        const recipient = this.getAttribute('recipient') || 'Family Member';
        const year = this.getAttribute('year') || '2026';
        const description = this.innerHTML || 'Detailed description of this milestone is pending archive synchronization.';

        this.innerHTML = `
            <article class="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-[0_10px_40px_-10px_rgba(6,44,34,0.05)] group hover:-translate-y-2 transition-transform duration-500 flex flex-col h-full reveal active">
                <!-- Image Header -->
                <div class="relative h-64 overflow-hidden bg-forest-900">
                    <img src="${imageSrc}" alt="${title}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" onerror="this.src='https://placehold.co/600x400/062c22/d4af37?text=Milestone'">
                    <div class="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500"></div>
                    
                    <div class="absolute bottom-0 left-0 p-6 w-full z-10">
                        <span class="inline-block px-3 py-1 bg-gold-500 text-forest-900 text-[0.65rem] font-bold uppercase tracking-widest rounded-sm mb-3 shadow-md backdrop-blur-md">${category}</span>
                        <h3 class="font-serif text-2xl md:text-3xl text-parchment leading-tight group-hover:text-gold-400 transition-colors duration-300 drop-shadow-md">${title}</h3>
                    </div>
                </div>
                
                <!-- Content Body -->
                <div class="p-6 md:p-8 flex-grow flex flex-col relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
                    <!-- Subtle background emblem -->
                    <div class="absolute top-4 right-4 text-forest-900/5 font-serif text-6xl leading-none pointer-events-none select-none italic">A</div>
                    
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 relative z-10 gap-2">
                        <span class="text-sm font-semibold text-forest-900 uppercase tracking-widest">${recipient}</span>
                        <span class="text-xs font-bold text-gray-400 font-serif italic bg-gray-50 px-3 py-1 rounded-full border border-gray-100 w-max">${year}</span>
                    </div>
                    
                    <div class="text-gray-600 font-light text-sm leading-relaxed flex-grow relative z-10">
                        ${description}
                    </div>
                    
                    <div class="mt-6 pt-4 border-t border-gray-50 flex justify-end relative z-10">
                        <button class="text-[0.65rem] font-bold text-gold-600 uppercase tracking-widest hover:text-forest-900 transition-colors flex items-center group-hover:translate-x-1 duration-300" onclick="console.log('Details modal feature pending')">
                            Read Full Story
                            <svg class="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
}

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
customElements.define('achievement-card', AchievementCard);
