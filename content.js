chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'fetchStats') {
      var statsContainer = document.getElementById('statsContainer');
      if (statsContainer) {
        // Extract the required data from the page and display it in the extension popup
        var globalRank = document.querySelector('[data-test="global-rank"] .wa-rank-list__value').innerText;
        var countryRank = document.querySelector('[data-test="country-rank"] .wa-rank-list__value').innerText;
        statsContainer.innerHTML = 'Global Rank: ' + globalRank + '<br>Country Rank: ' + countryRank;
      }
    }
  });
  