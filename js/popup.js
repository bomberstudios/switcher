var tabId = 0;

window.onload = function() {
  var bg = chrome.extension.getBackgroundPage();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(tabs && tabs.length > 0) {
      var uri = URI(tabs[0].url);
      tabId = tabs[0].id;
      if(uri) {
        var origin = uri.protocol() + "://" + uri.hostname();
        if (uri.port()) {
          origin += ":" + uri.port();
        }
        chrome.runtime.sendMessage({site:origin, popup:1}, function(response) {
          var keys = Object.keys(response).sort();
          var html = "<ul>";
          keys.forEach(function(key) {
            if (key != 'carry_params') {
              if(response[key] == origin) {
                html += "<li><span>" + response[key] + uri.pathname() + "</span></li>";
              }
              else {
                var href = response[key];
                if(response.carry_params) {
                  href = href + uri.pathname();
                }
                html += "<li><a href='" + href + "'>" + href + "</a></li>";
              }
            }
          });
          html += "</ul>";
          var links = document.getElementById("links");
          links.innerHTML = html;
        });
      }
    }
  });    
};


window.onclick = function(event) {
  if(event.target.nodeName == 'A') {
    if(event.target.href) {
      if(tabId) {
        chrome.tabs.update(tabId, {"url": event.target.href});
        window.close();
      }
    }
  }
};
