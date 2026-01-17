/**
 * nav-auth.js
 * Handles shared authentication UI logic for DataBridge Solutions.
 * Centralizes navbar updates and logout functionality.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Ensure db.js is loaded
    if (!window.db) {
        console.error("DataBridgeDB (db.js) not found. Navbar auth logic aborted.");
        return;
    }

    updateAuthState();

    // Listen for storage changes to sync state across tabs
    window.addEventListener("storage", (e) => {
        if (e.key === "db_current_user") {
            updateAuthState();
        }
    });
});

function updateAuthState() {
    const authButtons = document.getElementById('auth-buttons');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');

    if (!authButtons && !mobileAuthButtons) return;

    const currentUser = window.db.getCurrentUser();

    if (currentUser) {
        // Logged In UI
        if (authButtons) {
            authButtons.innerHTML = `
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Hi, ${currentUser.name.split(' ')[0]}</span>
                <button onclick="handleLogout()" class="flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#111418] dark:text-white text-sm font-bold h-11 px-6 rounded-lg transition-all active:scale-95">
                    Logout
                </button>
            `;
        }
        if (mobileAuthButtons) {
            mobileAuthButtons.innerHTML = `
                <p class="text-xl font-bold text-[#111418] dark:text-white">Welcome, ${currentUser.name}</p>
                <button onclick="handleLogout()" class="w-full bg-gray-100 dark:bg-white/10 text-xl font-bold py-4 rounded-xl">Logout</button>
            `;
        }
    } else {
        // Logged Out UI
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="./signin.html" class="text-sm font-bold text-[#111418] dark:text-white hover:text-primary dark:hover:text-accent-cyan transition-colors">Sign In</a>
                <a href="./signup.html" class="flex items-center justify-center cta-sweep bg-primary hover:bg-primary/90 text-white text-sm font-bold h-11 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-95">
                    Sign Up
                </a>
            `;
        }
        if (mobileAuthButtons) {
            mobileAuthButtons.innerHTML = `
                <a href="./signin.html" class="w-full text-center text-2xl font-bold py-4">Sign In</a>
                <a href="./signup.html" class="w-full text-center bg-primary text-white text-2xl font-bold py-4 rounded-xl shadow-lg shadow-primary/20">Sign Up</a>
            `;
        }
    }
}

function handleLogout() {
    window.db.logout();
    // Use a simple alert if toast system is not available on this page
    if (typeof showToast === "function") {
        showToast("Logged out successfully!", "success");
    } else {
        alert("Logged out successfully!");
    }

    setTimeout(() => {
        location.reload();
    }, 800);
}
