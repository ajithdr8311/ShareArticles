const postId = document.querySelector('.post-id').textContent;
const postTitle = document.querySelector('.edit-post-title');
const postContent = document.querySelector('.edit-post-content')
const saveBtn = document.querySelector('.edit-submit');

fetch(`/user/${postId}`)
    .then(res => res.json())
    .then(data => prefillData(data))
    .catch(err => console.log(err))

function prefillData(data) {
    postTitle.value = data.postDetails.title;
    postContent.value = data.postDetails.content;
}

saveBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const post = await fetch(`/save/${postId}`, {
        method: 'PUT',
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: postTitle.value, content: postContent.value })
    });
    const postJson = await post.json();
    postTitle.value = postJson.title;
    postContent.value = postJson.content;
})

