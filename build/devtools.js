// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create("BrowserFS", "toast.png", "panel.html", function(panel) {});