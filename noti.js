document.addEventListener('DOMContentLoaded', () => {
  const tabList = document.getElementById('tabList');
  const closeTabsBtn = document.getElementById('closeTabsBtn');
  const laterBtn = document.getElementById('laterBtn');
  const countdownText = document.getElementById('countdownText');

  // Get tabs from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const tabsJson = urlParams.get('tabs');
  const tabs = JSON.parse(decodeURIComponent(tabsJson));

  // Display tabs
  tabs.forEach(tab => {
    const tabItem = document.createElement('div');
    tabItem.className = 'flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md';
    
    const favicon = document.createElement('img');
    favicon.src = tab.favIconUrl || 'icons/icon16.png';
    favicon.className = 'w-4 h-4';
    
    const title = document.createElement('span');
    title.className = 'text-sm text-gray-700 truncate';
    title.textContent = tab.title;
    
    tabItem.appendChild(favicon);
    tabItem.appendChild(title);
    tabList.appendChild(tabItem);
  });

  // Start countdown
  let countdown = 10;
  const countdownInterval = setInterval(() => {
    countdown--;
    countdownText.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      closeTabs();
    }
  }, 1000);

  // Button handlers
  closeTabsBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    closeTabs();
  });

  laterBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    window.close();
  });

  function closeTabs() {
    // Send message to background script to close tabs
    chrome.runtime.sendMessage({
      type: 'CLOSE_TABS',
      tabIds: tabs.map(tab => tab.id)
    }, () => {
      window.close();
    });
  }
}); 