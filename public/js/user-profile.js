const logo = document.querySelector('.logo-register');
const profileSection = document.querySelector('.profile-section');
const profileId = document.querySelector('.profile-id').textContent;
const usernameEle = document.querySelector('.username-profile');
const emailEle = document.querySelector('.email-profile');
const bioEle = document.querySelector('.bio-profile');
const followersEle = document.querySelector('.followers-profile');
const followingEle = document.querySelector('.following-profile');
const postsEle = document.querySelector('.posts-profile');
const blogsArea = document.querySelector('.allBlogs');
const blogEle = document.querySelector('.all-blogs-list');
const createPostEle = document.querySelector('.posts-create');
const editProfileEle = document.querySelector('.profile-edit');

logo.addEventListener('click', (event) => {
    window.location.href = '/home';
});

createPostEle.addEventListener('click', (event) => {
    window.location.href = `/write/${profileId}`;
});

editProfileEle.addEventListener('click', (event) => {
    window.location.href = `/edit-profile/${profileId}`;
});

async function getUserPosts() {
    const userDetails = await fetch(`/users/${profileId}`);
    const userDetailsJson = await userDetails.json();
    populateDataProfile(userDetailsJson[0]);

    const activeUser = await fetch('/users/activeuser');
    const activeUserJson = await activeUser.json();
    const activeUserId = activeUserJson.id;

    if(profileId != activeUserId) {
        createPostEle.style.display = 'none';
        editProfileEle.style.display = 'none';
    }

    const userPosts = await fetch(`/user`);
    const userPostsJson = await userPosts.json();
    const blogs = userPostsJson.filter(blog => blog.user.id == profileId);
    populateDataPosts(blogs, activeUserId);
}

getUserPosts();



function populateDataProfile(data) {
    usernameEle.textContent = data.username;
    emailEle.textContent += data.email;
    bioEle.textContent += data.bio;
    followersEle.textContent += data.followedBy.length;
    followingEle.textContent += data.following.length;
    postsEle.textContent += data.posts.length;
}



function populateDataPosts(data, activeUserId) {
    for(let index = 0; index < data.length; index++) {
        const id = data[index].id;
        const user = data[index].user.username;
        const curUserId = data[index].user.id;
        const title = data[index].title;
        const content = data[index].content;
        const time = getTime(data[index].updatedAt);
        const likeCount = data[index].likes.length;

        createLayout(blogEle, {id, user, title, content, time, likeCount}, activeUserId, curUserId);
    }

    blogsArea.appendChild(blogEle);
}

// To render each blog post on the page;
function createLayout(element, blogDetails, activeUserId, curUserId) {
    const blog = document.createElement('section');
    blog.classList.add('individual-blog');
    blog.setAttribute('post-id', blogDetails.id);
    blog.addEventListener('click', async(e) => {
        const className = e.target.classList.value;
        if(className == 'blog-edit') {
            window.location.href = `/edit/${blogDetails.id}`;
            return;
        } else if(className == 'blog-delete') {
            const res = await fetch(`/user/${profileId}/posts/${blogDetails.id}`, { method: 'DELETE' });
            const data = await res.json();
            window.location.href = '';
            return;
        }
        window.location.href = `/blog/${blog.getAttribute('post-id')}`;
    })

    const userNameEle = document.createElement('h4');
    userNameEle.classList.add('blog-username');
    userNameEle.setAttribute('post-id', blogDetails.id);
    userNameEle.textContent = '@'+blogDetails.user;
    
    const updatedTimeEle = document.createElement('span');
    updatedTimeEle.classList.add('blog-updatedTime');
    updatedTimeEle.setAttribute('post-id', blogDetails.id);
    updatedTimeEle.textContent = blogDetails.time;

    const titleEle = document.createElement('h3');
    titleEle.classList.add('blog-title');
    titleEle.setAttribute('post-id', blogDetails.id);
    titleEle.textContent = blogDetails.title;

    const contentEle = document.createElement('p');
    contentEle.classList.add('blog-content');
    contentEle.setAttribute('post-id', blogDetails.id);
    contentEle.textContent = blogDetails.content.slice(0, 150) + '....';

    const likesCountEle = document.createElement('span');
    likesCountEle.classList.add('blog-likes');
    likesCountEle.setAttribute('post-id', blogDetails.id);
    likesCountEle.textContent = 'likes:' + blogDetails.likeCount;

    const editEle = document.createElement('button');
    editEle.classList.add('blog-edit');
    editEle.setAttribute('post-id', blogDetails.id);
    editEle.textContent = 'Edit';

    const deleteEle = document.createElement('button');
    deleteEle.classList.add('blog-delete');
    deleteEle.setAttribute('post-id', blogDetails.id);
    deleteEle.textContent = 'Delete';

    blog.append(userNameEle);
    blog.append(updatedTimeEle);
    blog.append(titleEle);
    blog.append(contentEle);
    blog.append(likesCountEle);

    if(curUserId == activeUserId) {
        blog.append(editEle);
        blog.append(deleteEle);
    }
    element.append(blog);
}


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