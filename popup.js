document.addEventListener('DOMContentLoaded', function() {
  var urlForm = document.getElementById('urlForm');
  var urlInput = document.getElementById('urlInput');
  var statsContainer = document.getElementById('statsContainer');
  var captchaFrame = document.getElementById('captchaFrame');


  const iframe = document.getElementById('captchaFrame');
iframe.sandbox = 'allow-scripts';


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

  // Handle premium subscription
  var checkoutButton = document.getElementById('checkoutButton');

  checkoutButton.addEventListener('click', function(event) {
    event.preventDefault();
    var email = prompt('Please enter your email:');
    if (email) {
      createSubscription(email);
    }
  });

  function createSubscription(email) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://dashboard.stripe.com/create-subscription', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.success) {
          alert('Subscription created successfully!');
          
          // Perform any necessary UI updates or actions for premium users
        } else {
          alert('Subscription creation failed. Please try again later.');
        }
      }
    };
    xhr.send(JSON.stringify({ email: email }));
  }





  var customerId = null;

  // Create a customer on the server
  fetch('https://YOUR_GLITCH_PROJECT_URL/create-customer', {
    method: 'POST',
  })
    .then((response) => response.json())
    .then((data) => {
      customerId = data.customer.id;
    })
    .catch((error) => console.error('Error:', error));

  // Create a premium plan session on the server
  function createPremiumSession() {
    fetch('https://YOUR_GLITCH_PROJECT_URL/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId: customerId }),
    })
      .then((response) => response.json())
      .then((data) => {
        stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
      })
      .catch((error) => console.error('Error:', error));
  }

  // Handle the "Buy Premium" button click event
  document.getElementById('buyPremiumBtn').addEventListener('click', function() {
    createPremiumSession();
  });
});



