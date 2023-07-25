
///////////////////////////////
/// toggle logo to darkmode ///
///////////////////////////////

// main page and some others
img = document.getElementById("ctl00_imgBrandingBy");
if (img)
{
    img.src = chrome.runtime.getURL("images/infoteam-logo.png");
    img.style.display = "block";
}

// other pages
img = document.querySelector("#headerBrandingLogo > img");
if (img && img.src != "https://mportal.infoteam.de/HRPortal/Content/Images/Sage_Logo_Black_RGB.svg")
{   
    img.src = chrome.runtime.getURL("images/infoteam-logo.png");
    img.style.display = "block";
}


////////////////////
/// Change Title ///
////////////////////

pageTitles = {
    "default": "Sage",
    "https://mportal.infoteam.de/mportal/Content/Home.aspx": "Sage • Startseite",
    "https://mportal.infoteam.de/HRPortal/de-DE/MPortal/Employees": "Sage • Mitarbeiter Loading...",
    "https://mportal.infoteam.de/HRPortal/de-DE/Employees/Overview?view=Default": "Sage • Mitarbeiter",
    "https://mportal.infoteam.de/mportal/Content/Aufgaben/Default.aspx": "Sage • Genehmigungen",
    "https://mportal.infoteam.de/mportal/Content/Zeit/FZ/Default.aspx": "Sage • Fehlzeiten",
    "https://mportal.infoteam.de/mportal/Content/Reise/Default.aspx": "Sage • Reise",
    "https://mportal.infoteam.de/mportal/Content/Zeit/ZW/Default.aspx": "Sage • Zeit",
    "https://mportal.infoteam.de/HRPortal/de-DE/Calendar/Employee": "Sage • Kalender",
    "https://mportal.infoteam.de/HRPortal/de-DE/Time/TimeTracking": "Sage • Zeiterfassung",
    "https://mportal.infoteam.de/HRPortal/de-DE/Time/ProjectTimeTracking/Overview": "Sage • Projektzeiterfassung"
};

function setTitle(title)
{
    if (!title)
    {
        setTitle(pageTitles["default"]);
        return;
    }
    if (document.title != title)
        document.title = title;
}

setInterval(() => {
    setTitle(pageTitles[window.location.href]);
}, 250);


//////////////////////////////////////////////////////
/// Initialize toggling time panel on landing page ///
//////////////////////////////////////////////////////

var iframe_loaded = false;
var time_panel_visibility = window.localStorage.getItem("time_panel_visibility");
var td_state = time_panel_visibility == "invisible" ? "StartmenueItem" : "StartmenueItemSelected";

var list = document.querySelector(".StartmenueItems > table > tbody");
var toggle_time_element_str = '<tr id="ctl00_cphContent_trZeitenbuchung"> <td class="' + td_state + '"> <span class="dxeBase_None DXLabel">Zeitenbuchung</span> </td> </tr>';
list.innerHTML += toggle_time_element_str;
var toggle_time_element = document.querySelector("#ctl00_cphContent_trZeitenbuchung");


toggle_time_element.onclick = () =>
{
    var iframe = document.querySelector("#iframe_time_panel"); 

    if (time_panel_visibility == "invisible" && iframe_loaded) {
        window.localStorage.setItem("time_panel_visibility", "visible");
        time_panel_visibility = "visible";
        toggle_time_element.children[0].classList.add("StartmenueItemSelected");
        toggle_time_element.children[0].classList.remove("StartmenueItem");
        iframe.style.display = "block";
    } else { 
        window.localStorage.setItem("time_panel_visibility", "invisible");
        time_panel_visibility = "invisible";
        toggle_time_element.children[0].classList.add("StartmenueItem");
        toggle_time_element.children[0].classList.remove("StartmenueItemSelected");
        iframe.style.display = "none";
    }
}

////////////////////////////////////////////
/// Load time panel on landing page ///
////////////////////////////////////////////

if (window.location.href == "https://mportal.infoteam.de/mportal/Content/Home.aspx")
{
    var iframe = document.createElement('iframe');
    iframe.style.display = "none";
    const URLs = [
        'https://mportal.infoteam.de/HRPortal/de-DE/Employees/Overview?view=Default',
        'https://mportal.infoteam.de/mportal/Content/Aufgaben/Default.aspx',
        'https://mportal.infoteam.de/mportal/Content/Zeit/FZ/Default.aspx',
        'https://mportal.infoteam.de/mportal/Content/Reise/Default.aspx',
        'https://mportal.infoteam.de/mportal/Content/Zeit/ZW/Default.aspx',
        'https://mportal.infoteam.de/HRPortal/de-DE/Calendar/Employee',
        'https://mportal.infoteam.de/HRPortal/de-DE/Time/TimeTracking',
        'https://mportal.infoteam.de/HRPortal/de-DE/Time/ProjectTimeTracking/Overview'
    ];

    iframe.src = 'https://mportal.infoteam.de/mportal/Content/Home.aspx';
    if (URLs.includes(document.referrer))
        iframe.src = 'https://mportal.infoteam.de/HRPortal/de-DE/Time/TimeTracking';
    
    iframe.width = '100%';
    iframe.height = '380px';
    iframe.id = 'iframe_time_panel';
    iframe.onload = function() {

        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        var maincssURL = chrome.runtime.getURL("css/main.css");
        var iframecssURL = chrome.runtime.getURL("css/iframe.css");
        var iframejsURL = chrome.runtime.getURL("scripts/iframe.js");
        var maincssLink = '<link rel="stylesheet" type="text/css" href="' + maincssURL + '" >';
        var iframecssLink = '<link rel="stylesheet" type="text/css" href="' + iframecssURL + '" >';
        var iframejsInject = '<script src=' + iframejsURL + '></script>';
        iframeDoc.head.innerHTML += maincssLink + iframecssLink + iframejsInject;

        on_timepage = iframeDoc.querySelector("#timepairs") != null;
        if (!on_timepage) {
            iframeDoc.querySelectorAll('[data-pnav-maitai="TimeTracking"]')[0].click();
        } else {
            setTimeout(() => {
                iframe_loaded = true;
                if (time_panel_visibility != "invisible")
                {
                    iframe.style.display = "block";
                }
            }, 150);
        }
    }

    iframe.style.margin = "40px 0 0 0";
    iframe.style.border = "none";

    document.querySelector("#ctl00_contentContainer").appendChild(iframe);
}


////////////////////////////////////
/// Auto click link for redirect ///
////////////////////////////////////

if (window.location.href == "https://mportal.infoteam.de/mportal/Logout.aspx" || window.location.href == "https://mportal.infoteam.de/mportal/Login.aspx?logout=true")
{
    document.querySelector(".dxeHyperlink").click();
}
