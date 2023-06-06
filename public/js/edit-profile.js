const userId = document.querySelector('.user-id').textContent;
const username = document.querySelector('.edit-username');
const email = document.querySelector('.edit-email');
const password = document.querySelector('.edit-password');
const bio = document.querySelector('.edit-bio');
const saveEdit = document.querySelector('.edit-submit');
const errorMsg = document.querySelector('.error-message');
errorMsg.style.color = 'red';

fetch(`/users/activeuser`)
    .then(res => res.json())
    .then(data => {
        fillDetails(data);
    })
    .catch(err => console.log(err));


function fillDetails(data) {
    username.value = data.username;
    email.value = data.email;
    bio.value = data.bio;
}


saveEdit.addEventListener('click', async (event) => {
    event.preventDefault()

    const isValid = checkCredentials(username.value, email.value, password.value);
    if(!isValid) {
        return;
    }


    const res = await fetch(`/users/${userId}`, {
        method: 'PUT',
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            username: username.value,
            email: email.value,
            password: password.value,
            bio: bio.value
        })
    });

    const resJson = await res.json();
    if(resJson.statusCode) {
        errorMsg.textContent += resJson.message;
    }
})


function checkCredentials(username, email, password) {
    errorMsg.innerHTML = '';
    let isValid = true;
    if(!username) {
        errorMsg.innerHTML += 'Username cannot be empty';
        isValid = false;
    } else if(username.length < 4) {
        errorMsg.innerHTML += 'Username must be atleast 4 characters long';
        isValid = false;
    }

    if(!email) {
        errorMsg.innerHTML += '<br>Email cannot be empty';
        isValid = false;
    } else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        errorMsg.innerHTML += '<br>Invalid Email address';
        isValid = false;
    }

    if(!password) {
        errorMsg.innerHTML += '<br>Password cannot be empty';
        isValid = false;
    } else if(password.length < 3) {
        errorMsg.innerHTML += '<br>Password must be atleast 3 characters long';
        isValid = false;
    }

    return isValid;
}
