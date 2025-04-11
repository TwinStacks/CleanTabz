// Store tab usage data
let tabUsage = new Map();

// Track active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateTabUsage(activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  
  chrome.tabs.query({active: true, windowId: windowId}, (tabs) => {
    if (tabs[0]) {
      updateTabUsage(tabs[0].id);
    }
  });
});

function updateTabUsage(tabId) {
  const now = Date.now();
  if (!tabUsage.has(tabId)) {
    tabUsage.set(tabId, {
      lastActive: now,
      focusCount: 1,
      openTime: now
    });
  } else {
    const usage = tabUsage.get(tabId);
    usage.lastActive = now;
    usage.focusCount++;
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_CHECK') {
    startCheckInterval(message.checkInterval, message.nextCheckTime);
  }
});

function startCheckInterval(checkInterval, nextCheckTime) {
  // Clear any existing interval
  if (window.checkIntervalId) {
    clearInterval(window.checkIntervalId);
  }

  const intervalMs = checkInterval.unit === 'minutes' 
    ? checkInterval.value * 60 * 1000 
    : checkInterval.value * 60 * 60 * 1000;

  // Set up new interval
  window.checkIntervalId = setInterval(() => {
    checkUnusedTabs();
  }, intervalMs);

  // Schedule first check
  const timeUntilFirstCheck = nextCheckTime - Date.now();
  if (timeUntilFirstCheck > 0) {
    setTimeout(() => {
      checkUnusedTabs();
    }, timeUntilFirstCheck);
  }
}

async function checkUnusedTabs() {
  // Get all tabs
  const tabs = await chrome.tabs.query({});
  
  // Filter and sort unused tabs
  const unusedTabs = tabs
    .filter(tab => {
      const usage = tabUsage.get(tab.id);
      if (!usage) return false;

      const timeOpen = Date.now() - usage.openTime;
      return timeOpen > 2 * 60 * 60 * 1000 && // Open for more than 2 hours
             usage.focusCount < 3; // Focused less than 3 times
    })
    .sort((a, b) => {
      const usageA = tabUsage.get(a.id);
      const usageB = tabUsage.get(b.id);
      return usageA.focusCount - usageB.focusCount;
    })
    .slice(0, 5); // Get top 5 unused tabs

  if (unusedTabs.length > 0) {
    showNotification(unusedTabs);
  }
}

function showNotification(tabs) {
  // Create notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '🧠 CleanTabz Gợi Ý Dọn Dẹp',
    message: `Có ${tabs.length} tab ít sử dụng. Bạn có muốn đóng chúng không?`,
    buttons: [
      { title: 'Đóng các tab này' },
      { title: 'Để sau' }
    ]
  });

  // Play sound
  const audio = new Audio('sounds/notification.mp3');
  audio.play();

  // Handle notification button clicks
  chrome.notifications.onButtonClicked.addListener(function listener(notificationId, buttonIndex) {
    if (buttonIndex === 0) {
      // Close tabs
      tabs.forEach(tab => {
        chrome.tabs.remove(tab.id);
        tabUsage.delete(tab.id);
      });
    }
    chrome.notifications.clear(notificationId);
    chrome.notifications.onButtonClicked.removeListener(listener);
  });
} 