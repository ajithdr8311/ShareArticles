const blogEle = document.querySelector('.show-blog');
const postId = document.getElementsByTagName('span')[0].textContent.trim();
const blogTitle = document.querySelector('.blog-title');
const blogOwner = document.querySelector('.blog-owner');
const blogTime = document.querySelector('.blog-updated-at');
const blogLike = document.querySelector('.blog-like-update');
const blogLikeCount = document.querySelector('.blog-likes');
const blogContent = document.querySelector('.blog-content');

document.addEventListener('DOMContentLoaded', (event) => {
    render();
});

function render() {
    fetch(`/user/${postId}`)
        .then(res => res.json())
        .then(data => populateData(data))
        .catch(err => console.log(err))
}


function populateData(data) {
    blogTitle.textContent = data.postDetails.title;
    blogOwner.textContent = '@'+ data.userDetails.username;
    blogTime.textContent = getTime(data.postDetails.updatedAt);
    blogLikeCount.textContent = 'Likes: ' + data.postDetails.likes.length;
    blogContent.textContent = data.postDetails.content;
}

window.addEventListener('load', async (event) => {
    const activeUser = await fetch('/users/activeuser');
    const userData = await activeUser.json();
    if(userData.statusCode) {
        blogLike.style.display = 'none';
    } else {
        const res = await getLikeStatus(userData.id);
        if(res) {
            blogLike.textContent = 'Dislike';
        } else{
            blogLike.textContent = 'Like';
        }
    }
})


async function getLikeStatus(userId) {
    const isLiked = await fetch(`/user/${userId}/posts/${postId}`);
    const isLikedStatus = await isLiked.json();
    return isLikedStatus.likeStatus;
}

blogLike.addEventListener('click', async (event) => {
    const activeUser = await fetch('/users/activeuser');
    const userData = await activeUser.json();

    const userId = userData.id;
    await fetch(`/user/${userId}/posts/${postId}`, { method: 'POST' });
    window.location.href = '';
})


function getTime(date) {
    const timestamp = new Date(date);
    const now = new Date();

    const timeDiff = now.getTime() - timestamp.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const timeAgo = days > 0 ? `${days} day${days > 1 ? "s" : ""} ago` :
                hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""} ago` :
                minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""} ago` :
                `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

    const formattedDate = timestamp.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return `${formattedDate}, ${timeAgo}`;
}