'use strict';
chrome || (chrome = browser);

var chExec = false;
var SERVER_CONNECTED = {
    'server': false,
    'server_main': false
};
var MessageConnect = {};


function getCookiesDomain(domain, name, callback) {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}
chrome.runtime.onInstalled.addListener(function (a) {
    switch (a.reason) {
        case "install":
            reloadPage();
        case "update":
            reloadPage();

    }
});
chrome.runtime.onConnect.addListener(function (data) {
    if (data.name == "PocketOptionRobot") {
        MessageConnect[data.name] = data;
        MessageConnect[data.name].onMessage.addListener(function (request, sender) {
            console.log(request, sender);
        });

        MessageConnect[data.name].onDisconnect.addListener(function (port) {
            console.log('PocketOptionRobot is disconnect: ', port);
            SERVER_CONNECTED = {
                'server': false,
                'server_main': false
            };
        });
    }
});

function reloadPage() {
    console.log('reloadPage');
    chrome.tabs.query({}, function (tabs) {
        for (let tab of tabs) {
            if (urlCheck(tab.url) == true) {
                chrome.tabs.reload(tab.id);
            }
        }
    });
}


function getCookies(domain, name, callback) {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (urlCheck(tab.url) == true && changeInfo.url === undefined) {

        if (chExec == false) {
            exec(tab);
        }
    }
});


function exec(tab) {

    chrome.tabs.executeScript(tab.id, {
        file: "src/process.js",
        runAt: "document_end",
        allFrames: !0
    }), (tab.id, {
        file: "src/timer.js",
        runAt: "document_end",
        allFrames: !0
    });
}

// دریافت پیامها
chrome.runtime.onMessage.addListener(
    function (request, sender, senderResponse) {
        switch (request.msg) {
            case "serverConnected":
                SERVER_CONNECTED.server = request.val;
                break;

            case "serverMainConnected":
                SERVER_CONNECTED.server_main = request.val;
                break;

            case "serverCheck":
                senderResponse(SERVER_CONNECTED);
                break;

            case "logout":
                MessageConnect["PocketOptionRobot"].postMessage({ msg: 'logout' });
                break;

            case 'reload':
                reloadPage();
                break;



        }

    }
);

// بررسی تب فعال و تغییر آن
var ACTIVE_CHANGE = {};
var ACTIVE_TIME = (10 * 60) * 1000;
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (urlCheck(tab.url) == true && tab.active == true) {
            try {
                clearTimeout(ACTIVE_CHANGE);
                ACTIVE_CHANGE = null;
            }
            catch {
            }

            ACTIVE_CHANGE = setTimeout(changeActive, ACTIVE_TIME);
        }
        else {
            try {
                clearTimeout(ACTIVE_CHANGE);
                ACTIVE_CHANGE = null;
            }
            catch {
            }
        }
    });

});
// chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
//     if (tab.active == true && urlCheck(tab.url)==true) {
//         try {
//             ACTIVE_CHANGE.clearTimeout();
//         }
//         catch{}
//         ACTIVE_CHANGE= setTimeout(changeActive,ACTIVE_TIME);
//     }
// });
function changeActive() {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        for (let tab of tabs) {
            if (ACTIVE_CHANGE && urlCheck(tab.url) == false && tab.active == false) {
                chrome.tabs.update(tab.id, { active: true });
                try {
                    clearTimeout(ACTIVE_CHANGE);
                    ACTIVE_CHANGE = null;
                }
                catch { }
                break;
            }
            else if (tabs.length == 1 && urlCheck(tab.url) == true) {
                chrome.tabs.create({
                    url: 'https://google.com'
                });
                chrome.tabs.query({ currentWindow: true }, function (tabs) {
                    for (let tab of tabs) {
                        if (urlCheck(tab.url) == false && tab.active == false) {
                            chrome.tabs.update(tab.id, { active: true });
                            try {
                                clearTimeout(ACTIVE_CHANGE);
                                ACTIVE_CHANGE = null;
                            }
                            catch { }
                            break;
                        }
                    }
                });
            }
        }
    });
}
// end


// تابع دامنه های مجاز
function urlCheck(url) {
    let urls = url.split('/');
    let res = false;
    // alert(urls[0]+'@'+urls[1]+'@'+urls[2]+'@'+urls[3]+'@'+urls[4]);
    try {
        if (urls[0] == 'https:'
            && urls[1] == ''
            && (urls[2] == 'po.trade' || urls[2] == 'pocketoption.com')
            // && (urls[3]=='en' || urls[3]=='fa'
            && urls[4] == 'cabinet'
        ) {
            res = true;
        }
    }
    catch (e) {
        // alert('error check url');
    }
    return res;
}