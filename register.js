// =============================================
// register.js — Sinai Guide Registration Page
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

setupPasswordToggle('eye-reg-pass', 'regPass');
setupPasswordToggle('eye-reg-conf', 'regConfPass');

// ─── Password Strength Meter ───────────────────────────────────────────────

const strengthBar   = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');

function getPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8)                        score++;
    if (/[A-Z]/.test(pw))                      score++;
    if (/[0-9]/.test(pw))                      score++;
    if (/[^A-Za-z0-9]/.test(pw))              score++;
    return score;
}

document.getElementById('regPass')?.addEventListener('input', () => {
    const pw    = document.getElementById('regPass').value;
    const score = getPasswordStrength(pw);
    const pct   = pw.length === 0 ? 0 : (score / 4) * 100;

    const configs = [
        { color: '#e74c3c', label: 'Weak',      labelColor: '#e74c3c' },
        { color: '#e67e22', label: 'Fair',       labelColor: '#e67e22' },
        { color: '#f1c40f', label: 'Good',       labelColor: '#c9a800' },
        { color: '#2ecc71', label: 'Strong',     labelColor: '#27ae60' },
        { color: '#1abc9c', label: 'Very Strong',labelColor: '#16a085' },
    ];

    if (pw.length === 0) {
        strengthBar.style.width = '0%';
        strengthLabel.textContent = '';
        return;
    }

    const cfg = configs[score] || configs[0];
    strengthBar.style.width    = `${pct}%`;
    strengthBar.style.background = cfg.color;
    strengthLabel.textContent    = cfg.label;
    strengthLabel.style.color    = cfg.labelColor;
});

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

// ─── Register Form Handler ────────────────────────────────────────────────

const regSubmitBtn = document.getElementById('regSubmit');
const regErrorMsg  = document.getElementById('regErrorMsg');

regSubmitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    hideError(regErrorMsg);

    const name            = document.getElementById('regName').value.trim();
    const email           = document.getElementById('regEmail').value.trim();
    const password        = document.getElementById('regPass').value.trim();
    const confirmPassword = document.getElementById('regConfPass').value.trim();
    const agreed          = document.getElementById('agreeTerms').checked;

    // ── Validation ──────────────────────────────────────
    if (!name || !email || !password || !confirmPassword) {
        showError(regErrorMsg, 'Please fill in all fields.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(regErrorMsg, 'Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        showError(regErrorMsg, 'Password must be at least 6 characters.');
        return;
    }
    if (password !== confirmPassword) {
        showError(regErrorMsg, 'Passwords do not match.');
        return;
    }
    if (!agreed) {
        showError(regErrorMsg, 'Please agree to the Terms of Service.');
        return;
    }

    // ── Loading State ────────────────────────────────────
    const originalText = regSubmitBtn.querySelector('.btn-text').textContent;
    setButtonLoading(regSubmitBtn, true, originalText);

    try {
        await registerUser(name, email, password, confirmPassword);
        setPendingEmail(email);
        showToast('Account created! Check your email for a confirmation code.', 'success');
        openConfirmModal(email);
    } catch (err) {
        showError(regErrorMsg, err.message || 'Registration failed. Please try again.');
    } finally {
        setButtonLoading(regSubmitBtn, false, originalText);
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

// ─── Email Confirmation Modal ─────────────────────────────────────────────

function openConfirmModal(email) {
    const modal = document.getElementById('confirmEmailModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Pre-fill fields
    const emailField = document.getElementById('confirmEmailInput');
    const sentTo     = document.getElementById('sentToEmail');
    if (emailField) emailField.value = email || getPendingEmail();
    if (sentTo)     sentTo.textContent = email || getPendingEmail();
}

function closeConfirmEmailModal() {
    const modal = document.getElementById('confirmEmailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close on backdrop click
document.getElementById('confirmEmailModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfirmEmailModal();
});

// Confirm Email submit
const confirmSubmitBtn = document.getElementById('confirmEmailSubmit');
confirmSubmitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('confirmEmailInput').value.trim();
    const code     = document.getElementById('confirmCodeInput').value.trim();
    const errorMsg = document.getElementById('confirmEmailError');
    hideError(errorMsg);

    if (!email || !code) {
        showError(errorMsg, 'Please enter your email and the confirmation code.');
        return;
    }

    const originalText = confirmSubmitBtn.querySelector('.btn-text').textContent;
    setButtonLoading(confirmSubmitBtn, true, originalText);

    try {
        await confirmEmail(email, code);
        clearPendingEmail();
        closeConfirmEmailModal();
        showToast('Email confirmed! Redirecting to login…', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    } catch (err) {
        showError(errorMsg, err.message || 'Invalid or expired code. Try again.');
    } finally {
        setButtonLoading(confirmSubmitBtn, false, originalText);
    }
});

// ─── Google Sign-up Callback ───────────────────────────────────────────────

window.handleGoogleCredential = async function (response) {
    try {
        const data = await loginWithGoogle(response.credential);
        saveUserSession(data);
        showToast(`Welcome, ${data.name || data.userName || 'User'}! 🎉`, 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } catch (err) {
        showToast(err.message || 'Google sign-in failed. Try again.', 'error');
    }
};

// ─── Init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect home
    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    // If pending email confirmation, open the modal
    if (getPendingEmail()) {
        openConfirmModal(getPendingEmail());
    }
});
