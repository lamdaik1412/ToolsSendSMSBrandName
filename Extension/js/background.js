// background.js
chrome.runtime.onInstalled.addListener(() => {
    // Lắng nghe sự kiện từ extension và gửi nó đến máy chủ Node.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        socket.emit('reloadJob', message);
    });
});
