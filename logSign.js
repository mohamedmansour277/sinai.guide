// =============================================
// logSign.js — Tab Switching + Form Handlers
// =============================================

const logChoice = document.querySelector('.loginChoise');
const signChoice = document.querySelector('.signChoise');
const bgSlide = document.querySelector('.backgroundSL');
const loginSec = document.querySelector('.loginSec');
const signSec = document.querySelector('.signSec');

// ─── Tab Switching ─────────────────────────────────────────────────────────

signChoice?.addEventListener('click', (e) => {
    e.preventDefault();
    if(bgSlide) bgSlide.style.left = "50%";
    if(loginSec) loginSec.style.display = "none";
    if(signSec) signSec.style.display = "flex";
    const signa = document.querySelector('.signa');
    const loga = document.querySelector('.loga');
    if(signa) signa.style.color = "white";
    if(loga) loga.style.color = "var(--mainColor)";
});

logChoice?.addEventListener('click', (e) => {
    e.preventDefault();
    if(bgSlide) bgSlide.style.left = "0%";
    if(signSec) signSec.style.display = "none";
    if(loginSec) loginSec.style.display = "flex";
    const signa = document.querySelector('.signa');
    const loga = document.querySelector('.loga');
    if(loga) loga.style.color = "white";
    if(signa) signa.style.color = "var(--mainColor)";
});

// ─── Login Form Handler ────────────────────────────────────────────────────

const loginSubmitBtn = document.getElementById('LoginSubmit');
loginSubmitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passInput').value.trim();
    const errorMsg = document.getElementById('formErrorMsg');

    if (!email || !password) {
        showFormError(errorMsg, 'Please fill in all fields correctly!');
        return;
    }

    const originalText = loginSubmitBtn.textContent;
    setButtonLoading(loginSubmitBtn, true, originalText);

    try {
        const data = await loginUser(email, password);
        saveUserSession(data);
        showToast(`Welcome back, ${data.name || data.userName || email}! 👋`, 'success');
        closeAuthModal();
        updateNavbarUI();
        clearFormInputs('login');
    } catch (err) {
        showFormError(errorMsg, err.message || 'Invalid email or password');
    } finally {
        setButtonLoading(loginSubmitBtn, false, originalText);
    }
});

// ─── Sign Up Form Handler ──────────────────────────────────────────────────

const signUpSubmitBtn = document.getElementById('signUpSubmit');
signUpSubmitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInputSign').value.trim();
    const email = document.getElementById('emailInputSign').value.trim();
    const password = document.getElementById('passInputSign').value.trim();
    const confirmPassword = document.getElementById('confPassInputSign').value.trim();
    const errorMsg = document.getElementById('signFormErrorMsg');

    if (!name || !email || !password || !confirmPassword) {
        showFormError(errorMsg, 'Please fill in all fields correctly!');
        return;
    }
    if (password !== confirmPassword) {
        showFormError(errorMsg, 'Passwords do not match!');
        return;
    }

    const originalText = signUpSubmitBtn.textContent;
    setButtonLoading(signUpSubmitBtn, true, originalText);

    try {
        await registerUser(name, email, password, confirmPassword);
        setPendingEmail(email);
        showToast('Account created! Check your email for confirmation code.', 'success');
        closeAuthModal();
        clearFormInputs('sign');
        openConfirmEmailModal();
    } catch (err) {
        showFormError(errorMsg, err.message || 'Registration failed. Try again.');
    } finally {
        setButtonLoading(signUpSubmitBtn, false, originalText);
    }
});

// ─── Email Confirmation Modal Handler ─────────────────────────────────────

function openConfirmEmailModal() {
    const modal = document.getElementById('confirmEmailModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Pre-fill email
        const emailField = document.getElementById('confirmEmailInput');
        if (emailField) emailField.value = getPendingEmail();
    }
}

function closeConfirmEmailModal() {
    const modal = document.getElementById('confirmEmailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

const confirmSubmitBtn = document.getElementById('confirmEmailSubmit');
if (confirmSubmitBtn) {
    confirmSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('confirmEmailInput').value.trim();
        const code = document.getElementById('confirmCodeInput').value.trim();
        const errorMsg = document.getElementById('confirmEmailError');

        if (!email || !code) {
            showFormError(errorMsg, 'Please enter your email and the confirmation code.');
            return;
        }

        const originalText = confirmSubmitBtn.textContent;
        setButtonLoading(confirmSubmitBtn, true, originalText);

        try {
            await confirmEmail(email, code);
            clearPendingEmail();
            closeConfirmEmailModal();
            showToast('Email confirmed! You can now log in.', 'success');
            openAuthModal('login');
        } catch (err) {
            showFormError(errorMsg, err.message || 'Invalid or expired code.');
        } finally {
            setButtonLoading(confirmSubmitBtn, false, originalText);
        }
    });
}

// ─── Change Password Modal Handler ─────────────────────────────────────────

function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const user = getUserSession();
        if (user && document.getElementById('cpEmailInput')) {
            document.getElementById('cpEmailInput').value = user.email;
        }
    }
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

const changePassSubmitBtn = document.getElementById('changePassSubmit');
if (changePassSubmitBtn) {
    changePassSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('cpEmailInput').value.trim();
        const currentPassword = document.getElementById('cpCurrentPassInput').value.trim();
        const newPassword = document.getElementById('cpNewPassInput').value.trim();
        const confirmPassword = document.getElementById('cpConfPassInput').value.trim();
        const errorMsg = document.getElementById('changePassError');

        if (!email || !currentPassword || !newPassword || !confirmPassword) {
            showFormError(errorMsg, 'Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showFormError(errorMsg, 'New passwords do not match!');
            return;
        }

        const originalText = changePassSubmitBtn.textContent;
        setButtonLoading(changePassSubmitBtn, true, originalText);

        try {
            await changePassword(email, currentPassword, newPassword, confirmPassword);
            closeChangePasswordModal();
            showToast('Password changed successfully! ✅', 'success');
        } catch (err) {
            showFormError(errorMsg, err.message || 'Failed to change password.');
        } finally {
            setButtonLoading(changePassSubmitBtn, false, originalText);
        }
    });
}

// ─── Google Sign-In Callback ───────────────────────────────────────────────

window.handleGoogleCredential = async function(response) {
    try {
        const data = await loginWithGoogle(response.credential);
        saveUserSession(data);
        showToast(`Welcome, ${data.name || data.userName || 'User'}! 🎉`, 'success');
        closeAuthModal();
        updateNavbarUI();
    } catch (err) {
        showToast(err.message || 'Google sign-in failed. Try again.', 'error');
    }
};

// ─── Close Modals on Backdrop Click ───────────────────────────────────────

document.getElementById('confirmEmailModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfirmEmailModal();
});
document.getElementById('changePasswordModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeChangePasswordModal();
});

// ─── Forgot Password → Open Change Password ────────────────────────────────

document.querySelector('.pForget a')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAuthModal();
    openChangePasswordModal();
});

// ─── Navbar Login/SignUp Buttons ───────────────────────────────────────────

document.getElementById('navLogIn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('login');
});
document.getElementById('navSignUp')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('sign');
});

// ─── Close loginSignContainer when clicking backdrop ──────────────────────

document.querySelector('.loginSignContainer')?.addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});

// ─── Helpers ───────────────────────────────────────────────────────────────

function showFormError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.classList.add('shake-error');
    setTimeout(() => el.classList.remove('shake-error'), 300);
}

function clearFormInputs(form) {
    if (form === 'login') {
        document.getElementById('emailInput').value = '';
        document.getElementById('passInput').value = '';
    } else {
        document.getElementById('nameInputSign').value = '';
        document.getElementById('emailInputSign').value = '';
        document.getElementById('passInputSign').value = '';
        document.getElementById('confPassInputSign').value = '';
    }
}

// ─── Init on Load ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarUI();

    // Check if user landed with a pending email confirmation
    if (getPendingEmail()) {
        openConfirmEmailModal();
    }
});