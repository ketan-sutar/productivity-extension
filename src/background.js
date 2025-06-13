let activeTabId = null;
let timer = null;

// Track when a new tab becomes active
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  trackStop();
  activeTabId = activeInfo.tabId;
  trackStart();
});

// Track when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    trackStop();
    activeTabId = null;
  }
});

// Track when window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window focused (e.g., user switched to another application)
    trackStop();
  } else {
    // Window focused, check if we need to restart tracking
    if (activeTabId) {
      trackStart();
    }
  }
});

// Start tracking time for the active tab
function trackStart() {
  if (timer) return; // Already tracking

  timer = setInterval(async () => {
    try {
      if (!activeTabId) return;

      const tab = await chrome.tabs.get(activeTabId);
      if (!tab?.url || !tab.url.startsWith("http")) return;

      const hostname = new URL(tab.url).hostname;
      const today = new Date().toISOString().split("T")[0];

      chrome.storage.local.get([today], (data) => {
        const stats = data[today] || {};
        stats[hostname] = (stats[hostname] || 0) + 1;
        chrome.storage.local.set({ [today]: stats });

        // Optional: Send update to popup if it's open
        chrome.runtime
          .sendMessage({
            type: "timeUpdate",
            data: { [today]: stats },
          })
          .catch(() => {});
      });
    } catch (err) {
      console.error("Error tracking tab:", err);
      trackStop();
    }
  }, 1000);
}

// Stop tracking time
function trackStop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Initialize
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      activeTabId = tabs[0].id;
      trackStart();
    }
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getActiveTab") {
    sendResponse({ activeTabId });
  }
});
