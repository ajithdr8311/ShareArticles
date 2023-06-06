const userId = document.querySelector('.user-id').textContent;
const postTitle = document.querySelector('.create-post-title');
const postContent = document.querySelector('.create-post-content')
const saveBtn = document.querySelector('.create-submit');
const errorMsg = document.querySelector('.error-message-create');

saveBtn.addEventListener('click', async(event) => {
    errorMsg.innerHTML = '';
    if(!postTitle.value.trim()) {
        errorMsg.innerHTML += 'Title cannot be empty'; 
    } else if(!postContent.value.trim()) {
        errorMsg.innerHTML += '<br>Blog content cannot be empty';
    } else {
        const publish = await fetch(`/user/${userId}/posts`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: postTitle.value.trim(),
                content: postContent.value.trim()
            })
        });

        const publishJson = await publish.json();
        window.location.href = `/profile/${userId}`;
    }
});