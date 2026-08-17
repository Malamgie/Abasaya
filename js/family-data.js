
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Portal | Abasaya Family Heritage</title>
    <link rel="stylesheet" href="css/style.css">
    <script type="module" src="js/components.js"></script>
</head>
<body class="font-sans antialiased text-charcoal bg-parchment min-h-screen flex flex-col">
    
    <app-header></app-header>

    <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('assets/images/hero-family-placeholder.jpg')] bg-cover bg-center relative">
        <div class="absolute inset-0 bg-forest/90 mix-blend-multiply"></div>
        
        <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl relative z-10 border border-gold/20">
            <div>
                <h2 class="mt-2 text-center text-3xl font-serif font-extrabold text-forest">
                    Family Portal
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Secure access for members of the Abasaya family.
                </p>
            </div>
            
            <form id="login-form" class="mt-8 space-y-6" onsubmit="event.preventDefault();">
                <div id="error-message" class="hidden bg-red-50 text-red-600 text-sm p-3 rounded border border-red-200 text-center"></div>
                
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="username" class="sr-only">Username</label>
                        <input id="username" name="username" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-forest focus:border-forest focus:z-10 sm:text-sm" placeholder="Username">
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-forest focus:border-forest focus:z-10 sm:text-sm" placeholder="Password">
                    </div>
                </div>

                <div>
                    <button type="submit" id="submit-btn" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-forest bg-gold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold shadow-md transition-all">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-forest/70 group-hover:text-forest" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        Sign in
                    </button>
                </div>
            </form>
            
            <div class="mt-4 text-center text-xs text-gray-400">
                <p>This system will be updated to Firebase Authentication.</p>
            </div>
        </div>
    </main>

    <app-footer></app-footer>

    <script type="module">
        import { AuthService } from './js/firebase-service.js';

        const form = document.getElementById('login-form');
        const btn = document.getElementById('submit-btn');
        const errorDiv = document.getElementById('error-message');

        form.addEventListener('submit', async () => {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            
            btn.innerHTML = 'Authenticating...';
            btn.disabled = true;
            errorDiv.classList.add('hidden');

            try {
                // Simulate slight network delay for premium feel
                await new Promise(r => setTimeout(r, 800));
                
                await AuthService.login(u, p);
                
                // Success - redirect to a future admin dashboard, or back to home
                btn.innerHTML = 'Success';
                btn.classList.replace('bg-gold', 'bg-green-500');
                btn.classList.replace('text-forest', 'text-white');
                
                setTimeout(() => {
                    window.location.href = 'index.html'; // In future phase, redirect to /admin/
                }, 500);

            } catch (err) {
                errorDiv.innerText = err.message || "Invalid credentials. Please try again.";
                errorDiv.classList.remove('hidden');
                btn.innerHTML = 'Sign in';
                btn.disabled = false;
            }
        });
    </script>
</body>
</html>
