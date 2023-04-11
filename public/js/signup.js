
const signUpTextEle = document.querySelector('.logo-register');
const registerBtn = document.querySelector('.submit-register');
const registerForm = document.querySelector('.registeration-form');
const statusMessage = document.querySelector('.status-reg');

signUpTextEle.addEventListener('click', () => {
    window.location.href = '/';
})

registerBtn.addEventListener('click', (event) => {
    event.preventDefault()
    const username = document.getElementById('username-reg').value;
    const email = document.getElementById('email-reg').value;
    const password = document.getElementById('password-reg').value;
    const bio = document.getElementById('bio-reg').value;

    const isValid = checkCredentials(username, email, password);
    if(!isValid) {
        return;
    }

    fetch('http://localhost:3000/users/register', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, email, password, bio})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.statusCode === 403) {
            statusMessage.textContent = data.message;
        } else if(data.statusCode === 201) {
            statusMessage.style.color = 'green'
            statusMessage.textContent = data.message;
            window.location.href = '/signin';
        }
    })
    .catch(err => console.log(err))
})


function checkCredentials(username, email, password) {

    statusMessage.innerHTML = '';
    let isValid = true;
    if(!username) {
        statusMessage.innerHTML += 'Username cannot be empty';
        isValid = false;
    } else if(username.length < 4) {
        statusMessage.innerHTML += 'Username must be atleast 4 characters long';
        isValid = false;
    }

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