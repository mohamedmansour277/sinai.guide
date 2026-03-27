// =============================================
// login_page.js — Sinai Guide Dedicated Login Page
// =============================================

// ─── Password Toggle ──────────────────────────────────────────────────────

function setupPasswordToggle(eyeId, inputId) {
    const eye = document.getElementById(eyeId);
    const inp = document.getElementById(inputId);
    if (!eye || !inp) return;
    eye.addEventListener('click', () => {
        const isText = inp.type === 'text';
        inp.type = isText ? 'password' : 'text';
        eye.classList.toggle('fa-eye', isText);
        eye.classList.toggle('fa-eye-slash', !isText);
    });
}

setupPasswordToggle('eye-login-pass', 'loginPass');
setupPasswordToggle('eye-cp-curr', 'cpCurrentPassInput');
setupPasswordToggle('eye-cp-new', 'cpNewPassInput');
setupPasswordToggle('eye-cp-conf', 'cpConfPassInput');

// ─── Form Error Helpers ───────────────────────────────────────────────────

function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.classList.add('shake-error');
    setTimeout(() => el.classList.remove('shake-error'), 350);
}

function hideError(el) {
    if (!el) return;
    el.style.display = 'none';
    el.textContent = '';
}

// ─── Login Form Handler ───────────────────────────────────────────────────

const loginSubmitBtn = document.getElementById('loginSubmit');
const loginErrorMsg  = document.getElementById('loginErrorMsg');

loginSubmitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    hideError(loginErrorMsg);

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value.trim();

    // ── Validation ──────────────────────────────────────
    if (!email || !password) {
        showError(loginErrorMsg, 'Please enter both email and password.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(loginErrorMsg, 'Please enter a valid email address.');
        return;
    }

    // ── Loading State ────────────────────────────────────
    const originalText = loginSubmitBtn.querySelector('.btn-text').textContent;
    setButtonLoading(loginSubmitBtn, true, originalText);

    try {
        const data = await loginUser(email, password);
        saveUserSession(data);
        showToast(`Welcome back, ${data.name || data.userName || email}! 👋`, 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } catch (err) {
        showError(loginErrorMsg, err.message || 'Invalid email or password. Please try again.');
    } finally {
        setButtonLoading(loginSubmitBtn, false, originalText);
    }
});

// ─── Button Loading State ─────────────────────────────────────────────────

function setButtonLoading(btn, loading, originalText) {
    const textSpan = btn.querySelector('.btn-text');
    btn.disabled = loading;
    if (textSpan) {
        textSpan.textContent = loading ? 'Please wait…' : originalText;
    } else {
        btn.textContent = loading ? 'Please wait…' : originalText;
    }
}

// ─── Change / Forgot Password Modal ───────────────────────────────────────

function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Auto-fill email if typed
    const emailField = document.getElementById('loginEmail')?.value;
    if (emailField) {
        document.getElementById('cpEmailInput').value = emailField;
    }
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Open modal from link
document.getElementById('forgotPassLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openChangePasswordModal();
});

// Close on backdrop click
document.getElementById('changePasswordModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeChangePasswordModal();
});

// Change Password submit
const changePassSubmitBtn = document.getElementById('changePassSubmit');
changePassSubmitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('cpEmailInput').value.trim();
    const currentPassword = document.getElementById('cpCurrentPassInput').value.trim();
    const newPassword = document.getElementById('cpNewPassInput').value.trim();
    const confirmPassword = document.getElementById('cpConfPassInput').value.trim();
    const errorMsg = document.getElementById('changePassError');
    hideError(errorMsg);

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
        showError(errorMsg, 'Please fill in all fields.');
        return;
    }
    if (newPassword !== confirmPassword) {
        showError(errorMsg, 'New passwords do not match!');
        return;
    }

    const originalText = changePassSubmitBtn.querySelector('.btn-text').textContent;
    setButtonLoading(changePassSubmitBtn, true, originalText);

    try {
        await changePassword(email, currentPassword, newPassword, confirmPassword);
        closeChangePasswordModal();
        showToast('Password changed successfully! ✅', 'success');
    } catch (err) {
        showError(errorMsg, err.message || 'Failed to change password. Please check your credentials.');
    } finally {
        setButtonLoading(changePassSubmitBtn, false, originalText);
    }
});


// ─── Google Sign-in Callback ───────────────────────────────────────────────

window.handleGoogleCredential = async function (response) {
    try {
        const data = await loginWithGoogle(response.credential);
        saveUserSession(data);
        showToast(`Welcome back, ${data.name || data.userName || 'User'}! 🎉`, 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } catch (err) {
        showToast(err.message || 'Google sign-in failed. Try again.', 'error');
    }
};

// ─── Init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect home
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
});
