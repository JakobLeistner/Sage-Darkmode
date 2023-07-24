chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
    var message = { command: 'popupOpened' };
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: mySendMessage,
        args: [message]
    });
});

document.getElementById('lightButton').addEventListener('click', function() {

    // Nachricht an den aktiven Tab senden
    chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        var message = { command: 'invertColors' };
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: mySendMessage,
            args: [message]
        });
    });
});

function mySendMessage(message) {
    chrome.runtime.sendMessage(message.tabId, message);
}