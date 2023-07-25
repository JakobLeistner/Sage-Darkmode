chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.command)
    {
        case 'popupOpened':
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                func: onOpenPopup,
                args: [sender.tab.id]
            });
            break;
        
        case 'invertColors':
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                func: invertColors,
                args: []
            });
    }
});


function invertColors()
{
    console.log("inverting colors");
    document.body.style.filter = document.body.style.filter == "invert(1)" ? "invert(0)" : "invert(1)";
}

function onOpenPopup(tabId)
{
    console.log("popup clicked");
    console.log(tabId);
    var stylesheetUrl = chrome.runtime.getURL("css/bright.css");
    // linkElement = '<link rel="stylesheet" id="brightStylesheet" type="text/css" href="' + stylesheetUrl + '" >';
    
    if (mode == 1)
    {
        document.getElementById("brightStylesheet").remove();
    }
    else
    {
        document.head.innerHTML += linkElement;
    }

    mode = mode *-1 + 1;
}