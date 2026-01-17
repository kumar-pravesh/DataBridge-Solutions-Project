/**
 * Auth Manager - Handles Admin Session
 */
class AuthManager {
    constructor() {
        this.checkOnly = false;
    }

    login(username, password) {
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('admin_session', 'true');
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('admin_session');
        window.location.href = './login.html';
    }

    checkSession() {
        const session = localStorage.getItem('admin_session');
        const isLoginPage = window.location.pathname.includes('login.html');

        if (!session && !isLoginPage) {
            // Redirect to login if no session and trying to access admin pages
            // Assuming this script is running in /admin/ context
            if (window.location.pathname.includes('/admin/')) {
                window.location.href = './login.html';
            }
        } else if (session && isLoginPage) {
            // Redirect to dashboard if already logged in
            window.location.href = './dashboard.html';
        }
    }
}

window.auth = new AuthManager();
// Auto-check on load
if (window.location.pathname.includes('/admin/')) {
    window.auth.checkSession();
}
