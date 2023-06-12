document.addEventListener('DOMContentLoaded', function() {
    var urlForm = document.getElementById('urlForm');
    var urlInput = document.getElementById('urlInput');
    var statsContainer = document.getElementById('statsContainer');
    var captchaFrame = document.getElementById('captchaFrame');
  
    // Get the current active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTab = tabs[0];
      var url = currentTab.url;
      urlInput.value = url;
      getWebsiteStats(url);
    });
  
    urlForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var url = urlInput.value.trim();
      if (url === '') {
        return;
      }
      getWebsiteStats(url);
    });
  
    function getWebsiteStats(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.similarweb.com/website/' + url.replace('https://www.', '') + '/#overview', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var parser = new DOMParser();
          var responseDoc = parser.parseFromString(xhr.responseText, 'text/html');
          var statsElement = responseDoc.querySelector('.wa-overview__row');
          var captchaElement = responseDoc.querySelector('.sec-container'); // Replace with the actual class of the CAPTCHA element
  
          if (statsElement) {
            statsContainer.innerHTML = '';
            statsContainer.appendChild(statsElement);
            captchaFrame.style.display = 'none';
          } else if (captchaElement) {
            statsContainer.innerHTML = 'CAPTCHA verification required.';
            captchaFrame.src = 'https://www.similarweb.com/website/' + url.replace('https://', '') + '/#overview';
            captchaFrame.style.display = 'block';
          } else {
            statsContainer.innerHTML = 'Stats not found.';
            captchaFrame.style.display = 'none';
          }
        }
      };
      xhr.send();
    }
  
    var notLoadingLink = document.getElementById('notLoadingLink');
  
    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTab = tabs[0];
      var url = currentTab.url;
      var modifiedUrl = getModifiedUrl(url);
      notLoadingLink.href = modifiedUrl;
    });
  
    function getModifiedUrl(url) {
      // Remove 'https://' and everything after the first slash
      var modifiedUrl = url.replace('https://', '');
      modifiedUrl = modifiedUrl.split('/')[0];
  
      // Construct the final URL
      return 'https://www.similarweb.com/website/' + modifiedUrl + '/#overview';
    }
  
    // Open new tab when the link is clicked
    notLoadingLink.addEventListener('click', function(event) {
      event.preventDefault();
      window.open(notLoadingLink.href, '_blank');
    });
  });
  