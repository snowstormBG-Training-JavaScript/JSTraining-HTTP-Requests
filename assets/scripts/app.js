const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const fetchPostsButton = document.querySelector('#available-posts > button');
// const addNewPostTitle = document.getElementById('title');
// const addNewPostContent = document.getElementById('content');
// const addNewPostSubmit = document.querySelector('#new-post button');
const addNewPostForm = document.querySelector('#new-post form');

function sendHttpRequest(method, url, data) {
    //promisifying...
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error('Something went wrong!'));
            }
            // const listOfPosts = JSON.parse(xhr.response);  //we commented this out to instead get the same by setting the xhr.responseType to 'json'

        };

        xhr.onerror = function () {
            reject(new Error('Failed to send request!'));
        };

        xhr.send(JSON.stringify(data));
    });
}

async function fetchPosts() {
    try {
        listElement.innerHTML = '';
        await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts')
            .then((responseData => {
                    generateTemplatedPost(responseData);
                })
            );
    } catch (err) {
        console.log(err);
    }

}

fetchPostsButton.addEventListener('click', fetchPosts);

function postDeleteButtonHandler(id) {
    sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${id}`);
}

const generateTemplatedPost = (postData) => {
    postData.forEach((entry) => {
        const newPost = document.importNode(postTemplate.content, true);

        newPost.querySelector('h2').innerText = entry.title.toUpperCase();
        newPost.querySelector('p').innerText = entry.body;
        newPost.querySelector('li').dataset.id = entry.id;
        newPost.querySelector('li').dataset.userId = entry.userId;
        // newPost.querySelector('button').addEventListener('click', () => {
        //     postDeleteButtonHandler(entry.id);
        // });
        //  ^^^ This adds an event listener to every delete button.
        //      Lets instead use delegation and have a single listener on the list, that handles post deletion.

        listElement.append(newPost);
    });
};

listElement.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
        const id = event.target.closest('li').dataset['id'];
        postDeleteButtonHandler(id);
        const postElement = listElement.querySelector(`li[data-id="${id}"]`);
        postElement.parentElement.removeChild(postElement);
    }
});

function addPostHandler(title, content) {
    // const title = addNewPostTitle.value;
    // const content = addNewPostContent.value;
    if (title && content) {
        createPost(title, content);
    }
}

async function createPost(title, content) {
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: userId
    };

    const response = await sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
    generateTemplatedPost([{
        title: post.title,
        body: post.body,
        userId: userId,
        id: response.id
    }]);
}


addNewPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;
    addPostHandler(enteredTitle, enteredContent);
});

// createPost('Dummy Title', ' Dummy content..............................');

