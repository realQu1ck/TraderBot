console.log('Injecting in process (Please Wait) ...');
var s = document.createElement('script');
s.src = chrome.extension.getURL('content.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement)
.appendChild(s);