
const logoutBtn = document.querySelector('.btn-logout');
const userIcon = document.querySelector('.user-icon');
const blogsArea = document.querySelector('.allBlogs');
const blogEle = document.querySelector('.all-blogs-list');



logoutBtn.addEventListener('click', () => {
    fetch('/users/logout', {method: 'POST'})
        .then(res => res.json())
        .then(data => {
            if(data.message) {
                window.location.href = '/';
            }
        })
        .catch(err => log(err));
})


fetch('users/activeuser')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.statusCode) {
            window.location.href = '/';
            return;
        }

        userIcon.setAttribute('title', data.username);
        userIcon.addEventListener('click', () => {
            window.location.href = `/profile/${data.id}`
        })
        // console.log(data);
    })
    .catch(err => console.log(err))


fetch('/user')
    .then(res => res.json())
    .then(data => {
        data.sort((blog1, blog2) => blog2.likes.length - blog1.likes.length)
        populateData(data)
    })
    .catch(err => console.log(err));

function populateData(data) {

    for(let index = 0; index < data.length; index++) {
        const id = data[index].id;
        const userId = data[index].user.id;
        const user = data[index].user.username;
        const title = data[index].title;
        const content = data[index].content;
        const time = getTime(data[index].updatedAt);
        const likeCount = data[index].likes.length;

        createLayout(blogEle, {id, userId, user, title, content, time, likeCount});
    }

    blogsArea.appendChild(blogEle);
}

// To render each blog post on the page;
function createLayout(element, blogDetails) {
    const blog = document.createElement('section');
    blog.classList.add('individual-blog');
    blog.setAttribute('post-id', blogDetails.id);
    blog.addEventListener('click', (e) => {
        if(e.target.classList.value == 'blog-username') {
            window.location.href = `/profile/${blogDetails.userId}`;
        } else {
            window.location.href = `blog/${blog.getAttribute('post-id')}`;
        }
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

    blog.append(userNameEle);
    blog.append(updatedTimeEle);
    blog.append(titleEle);
    blog.append(contentEle);
    blog.append(likesCountEle);
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