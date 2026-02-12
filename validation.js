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

document.getElementById('emailInput').addEventListener('input', (e) => applyStyle(e.target, patterns.email.test(e.target.value)));
document.getElementById('passInput').addEventListener('input', (e) => applyStyle(e.target, patterns.password.test(e.target.value)));
document.getElementById('nameInputSign').addEventListener('input', (e) => applyStyle(e.target, patterns.name.test(e.target.value)));
document.getElementById('emailInputSign').addEventListener('input', (e) => applyStyle(e.target, patterns.email.test(e.target.value)));
document.getElementById('passInputSign').addEventListener('input', () => {
    applyStyle(document.getElementById('passInputSign'), patterns.password.test(document.getElementById('passInputSign').value));
    checkPasswordMatch();
});
document.getElementById('confPassInputSign').addEventListener('input', checkPasswordMatch);

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const inputs = this.querySelectorAll('input');
        const errorDisplay = this.querySelector('.form-error-msg');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!input.classList.contains('input-success')) {
                isFormValid = false;
                input.classList.add('input-error');
            }
        });

        if (!isFormValid) {
            e.preventDefault();
            errorDisplay.style.display = 'block';
            errorDisplay.classList.add('shake-error');
            setTimeout(() => errorDisplay.classList.remove('shake-error'), 300);
        } else {
            errorDisplay.style.display = 'none';
        }
    });
});
const togglePasswordIcons = document.querySelectorAll('.toggle-password');

togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const passwordInput = this.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});