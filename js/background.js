var sites = {};
var groups = [];
loadSettings();

function loadSettings() {
  // TODO: fix JS error when first running the extension and settings are empty
  sites = JSON.parse(localStorage.sites) || {};
  groups = JSON.parse(localStorage.groups) || [];
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(sites[request.site] !== undefined && request.popup) {
    sendResponse(groups[sites[request.site]]);
  }
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(updateListener);
chrome.tabs.onCreated.addListener(createListener);
chrome.tabs.onReplaced.addListener(replaceListener);
    
function replaceListener(added, removed) {
  chrome.tabs.get(added, createListener);
}
                                   
function createListener(tab) {
  showSwitcher(tab);
}

function updateListener(tabId, changeInfo, tab) {
  if(tabId && changeInfo && changeInfo.status && changeInfo.status == "loading") {
    showSwitcher(tab);
  }
}

function showSwitcher(tab) {
  if(tab && tab.id && tab.url) {
    var uri = URI(tab.url);
    if(uri) {
      var origin = uri.protocol() + "://" + uri.hostname();
      if (uri.port()) {
        origin += ":" + uri.port();
      }
      if(sites[origin] !== undefined) {
        chrome.pageAction.show(tab.id);
      }
      else {
        chrome.pageAction.hide(tab.id);
      }
    }
  }
}
