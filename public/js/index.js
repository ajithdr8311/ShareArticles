
const registerBtn = document.querySelector('.btn-register');
const loginBtn = document.querySelector('.btn-signin');

registerBtn.addEventListener('click', () => {
    window.location.href = '/onboard';
})

loginBtn.addEventListener('click', () => {
    window.location.href = '/signin';
})