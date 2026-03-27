// =============================================
// auth.js — Sinai Guide Authentication Module
// API Base: https://sinatourist.runasp.net
// =============================================

const API_BASE = 'https://sinatourist.runasp.net';

// ─── Session Helpers ───────────────────────────────────────────────────────

function saveUserSession(data) {
    localStorage.setItem('sg_token', data.token || '');
    localStorage.setItem('sg_user', JSON.stringify({
        name: data.name || data.userName || '',
        email: data.email || '',
    }));
}

function getUserSession() {
    const user = localStorage.getItem('sg_user');
    return user ? JSON.parse(user) : null;
}

function getToken() {
    return localStorage.getItem('sg_token') || '';
}

function clearUserSession() {
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_user');
}

function isLoggedIn() {
    return !!getToken() && !!getUserSession();
}

// ─── Navbar UI State ───────────────────────────────────────────────────────

function updateNavbarUI() {
    const logSignDiv = document.querySelector('.logSign');
    if (!logSignDiv) return;

    if (isLoggedIn()) {
        const user = getUserSession();
        const initial = (user.name || user.email || '?')[0].toUpperCase();
        logSignDiv.innerHTML = `
            <div class="sg-profile" id="sgProfile">
                <button class="sg-avatar" id="sgAvatarBtn" aria-label="Profile menu">
                    ${initial}
                </button>
                <div class="sg-dropdown" id="sgDropdown">
                    <div class="sg-dropdown-header">
                        <div class="sg-dropdown-avatar">${initial}</div>
                        <div class="sg-dropdown-info">
                            <span class="sg-dropdown-name">${user.name || 'User'}</span>
                            <span class="sg-dropdown-email">${user.email || ''}</span>
                        </div>
                    </div>
                    <div class="sg-dropdown-divider"></div>
                    <button class="sg-dropdown-item" id="changePassNavBtn">
                        <i class="fa-solid fa-lock"></i> Change Password
                    </button>
                    <div class="sg-dropdown-divider"></div>
                    <button class="sg-dropdown-item sg-dropdown-logout" id="logoutBtn">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
        `;

        document.getElementById('sgAvatarBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('sgDropdown').classList.toggle('sg-dropdown-open');
        });

        document.addEventListener('click', function closeDropdown(e) {
            const profile = document.getElementById('sgProfile');
            if (!profile || !profile.contains(e.target)) {
                document.getElementById('sgDropdown')?.classList.remove('sg-dropdown-open');
                document.removeEventListener('click', closeDropdown);
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        document.getElementById('changePassNavBtn')?.addEventListener('click', () => {
            document.getElementById('sgDropdown')?.classList.remove('sg-dropdown-open');
            if (typeof openChangePasswordModal === 'function') openChangePasswordModal();
        });

    } else {
        logSignDiv.innerHTML = `
            <a href="register.html" class="signUp" id="navSignUp">SignUp</a>
            <a href="login.html" class="logIn" id="navLogIn">Login</a>
        `;
    }
}

function openAuthModal(tab) {
    const container = document.querySelector('.loginSignContainer');
    if (!container) return;
    container.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (tab === 'sign') {
        document.querySelector('.signChoise')?.click();
    } else {
        document.querySelector('.loginChoise')?.click();
    }
}

function closeAuthModal() {
    const container = document.querySelector('.loginSignContainer');
    if (container) {
        container.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// ─── API: Register ─────────────────────────────────────────────────────────

async function registerUser(name, email, password, confirmPassword) {
    const res = await fetch(`${API_BASE}/api/Account/Register/User`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.title || 'Registration failed');
    return data;
}

// ─── API: Login ────────────────────────────────────────────────────────────

async function loginUser(email, password) {
    const res = await fetch(`${API_BASE}/api/Account/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.title || 'Login failed');
    return data;
}

// ─── API: Google Sign-in ───────────────────────────────────────────────────

async function loginWithGoogle(idToken) {
    const res = await fetch(`${API_BASE}/api/Account/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.title || 'Google login failed');
    return data;
}

// ─── API: Confirm Email ────────────────────────────────────────────────────

async function confirmEmail(email, code) {
    const res = await fetch(`${API_BASE}/api/Account/Confirm-Email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.title || 'Email confirmation failed');
    return data;
}

// ─── API: Change Password ──────────────────────────────────────────────────

async function changePassword(email, currentPassword, newPassword, confirmPassword) {
    const res = await fetch(`${API_BASE}/api/Account/ChangePassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ email, currentPassword, newPassword, confirmPassword })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.title || 'Password change failed');
    return data;
}

// ─── API: Logout ───────────────────────────────────────────────────────────

async function logoutUser() {
    try {
        await fetch(`${API_BASE}/api/Account/Logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
    } catch (_) { /* silent fail */ }
    clearUserSession();
}

// ─── Handler: Logout ───────────────────────────────────────────────────────

async function handleLogout() {
    await logoutUser();
    updateNavbarUI();
    showToast('Logged out successfully', 'success');
}

// ─── Toast Notifications ───────────────────────────────────────────────────

function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `sg-toast sg-toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('sg-toast-show'));
    setTimeout(() => {
        toast.classList.remove('sg-toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ─── Button Loading State ──────────────────────────────────────────────────

function setButtonLoading(btn, loading, originalText) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait...' : originalText;
}

// ─── Pending Email (for confirmation step) ─────────────────────────────────

function setPendingEmail(email) {
    sessionStorage.setItem('sg_pending_email', email);
}

function getPendingEmail() {
    return sessionStorage.getItem('sg_pending_email') || '';
}

function clearPendingEmail() {
    sessionStorage.removeItem('sg_pending_email');
}
