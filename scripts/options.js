function save_options() {
    const server = document.getElementById('server').value;
    chrome.storage.sync.set({
        server: server,
    });
}

function restore_options() {
    chrome.storage.sync.get({
        server: 'https://sz2.ixarea.com/review/'
    }, function (items) {
        document.getElementById('server').value = items.server;
    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    restore_options();
    document.getElementById('server').addEventListener('change', save_options);
});
