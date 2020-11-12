const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');

function sendHttpRequest(method, url) {
    //promisifying...
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';

        xhr.onload = function () {
            resolve(xhr.response);
            // const listOfPosts = JSON.parse(xhr.response);  //we commented this out to instead get the same by setting the xhr.responseType to 'json'

        };

        xhr.send();
    });
}

function fetchPosts() {
    sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts')
        .then((responseData => {
                console.log(responseData);
                generateTemplatedPost(responseData);
            })
        );
}

fetchPosts();

const generateTemplatedPost = (postData) => {
    postData.forEach((entry) => {
        // const newPost = document.createElement('li');
        const newPost = document.importNode(postTemplate.content, true);
        // newPost.className = 'post-item';
        // newPost.dataset.id = entry.id;
        // newPost.dataset.userId = entry.userId;

        newPost.querySelector('h2').innerText = entry.title.toUpperCase();
        newPost.querySelector('p').innerText = entry.body;
        newPost.querySelector('li').dataset.id = entry.id;
        newPost.querySelector('li').dataset.userId = entry.userId;

        // newPost.innerHTML = `
        // <h2>${entry.title}</h2>
        // <p>${entry.body}</p>
        // <button>Delete</button>
        // `;
        listElement.append(newPost);
    });
};
