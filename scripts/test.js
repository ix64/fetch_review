var url = 'https://example.com/profile';
var data = {username: 'example'};

fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: new Headers({
        'Content-Type': 'application/json'
    })
})

    .then(response => console.log('Success:', response))
    .catch(function (error) {

            console.log('There has been a problem with your fetch operation: ', error.message);

        }
    );