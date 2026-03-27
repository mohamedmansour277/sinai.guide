// =============================================
// validation.js — Real-time Input Validation
// =============================================

const patterns = {
    name: /^[a-zA-Z\s\u0600-\u06FF]{3,30}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
};

function applyStyle(input, isValid) {
    if (isValid) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
    } else {
        input.classList.remove('input-success');
        input.classList.add('input-error');
    }
    if (input.value === "") input.classList.remove('input-error', 'input-success');
}

function checkPasswordMatch() {
    const pass = document.getElementById('passInputSign');
    const confPass = document.getElementById('confPassInputSign');
    if (!pass || !confPass) return;

    if (confPass.value === "") {
        confPass.classList.remove('input-error', 'input-success');
        return;
    }
    if (confPass.value === pass.value && pass.classList.contains('input-success')) {
        applyStyle(confPass, true);
    } else {
        applyStyle(confPass, false);
    }
}

// ─── Live validation listeners ─────────────────────────────────────────────

document.getElementById('emailInput')?.addEventListener('input', (e) =>
    applyStyle(e.target, patterns.email.test(e.target.value)));

document.getElementById('passInput')?.addEventListener('input', (e) =>
    applyStyle(e.target, patterns.password.test(e.target.value)));

document.getElementById('nameInputSign')?.addEventListener('input', (e) =>
    applyStyle(e.target, patterns.name.test(e.target.value)));

document.getElementById('emailInputSign')?.addEventListener('input', (e) =>
    applyStyle(e.target, patterns.email.test(e.target.value)));

document.getElementById('passInputSign')?.addEventListener('input', () => {
    const el = document.getElementById('passInputSign');
    applyStyle(el, patterns.password.test(el.value));
    checkPasswordMatch();
});

document.getElementById('confPassInputSign')?.addEventListener('input', checkPasswordMatch);

// ─── Password Toggle (covers all forms including modals) ───────────────────

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-password')) {
        const passwordInput = e.target.previousElementSibling;
        if (!passwordInput) return;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        e.target.classList.toggle('fa-eye');
        e.target.classList.toggle('fa-eye-slash');
    }
});