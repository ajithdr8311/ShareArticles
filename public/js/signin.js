const logo = document.querySelector('.logo-register');
const loginBtn = document.querySelector('.submit-login');
const statusMessage = document.querySelector('.status-login');


logo.addEventListener('click', () => {
    window.location.href = '/';
})

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const isValid = checkCredentials(email, password);
    if(!isValid) {
        return;
    } 

    fetch('http://localhost:3000/users/login', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.statusCode === 401) {
            statusMessage.textContent = data.message;
        } else if(data.statusCode === 200) {
            statusMessage.style.color = 'green'
            statusMessage.textContent = data.message;
            window.location.href = '/';
        }
    })
    .catch(err => console.log(err))


})

function checkCredentials(email, password) {
    statusMessage.innerHTML = '';
    let isValid = true;

    if(!email) {
        statusMessage.innerHTML += '<br>Email cannot be empty';
        isValid = false;
    } else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        statusMessage.innerHTML += '<br>Invalid Email address';
        isValid = false;
    }

    if(!password) {
        statusMessage.innerHTML += '<br>Password cannot be empty';
        isValid = false;
    } else if(password.length < 3) {
        statusMessage.innerHTML += '<br>Password must be atleast 3 characters long';
        isValid = false;
    }

    return isValid;
}