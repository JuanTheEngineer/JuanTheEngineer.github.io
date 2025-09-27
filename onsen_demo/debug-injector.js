// Real-time debugging injector for white screen issue
// Paste this into browser console on index.html to trace the issue

console.log('🚀 DEBUG INJECTOR LOADED - Tracing white screen issue');

// Create debug overlay
const debugOverlay = document.createElement('div');
debugOverlay.id = 'debug-overlay';
debugOverlay.style.cssText = `
  position: fixed;
  top: 10px;
  left: 10px;
  width: 350px;
  max-height: 400px;
  background: rgba(0,0,0,0.9);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 11px;
  z-index: 9999;
  overflow-y: auto;
  border: 2px solid #ff6b6b;
`;
document.body.appendChild(debugOverlay);

let debugLog = [];

function addDebugLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}`;
  debugLog.push(logEntry);
  console.log(`🐛 ${logEntry}`);

  // Update overlay
  const colors = {
    error: '#ff6b6b',
    warn: '#ffa726',
    success: '#4caf50',
    info: '#2196f3'
  };

  debugOverlay.innerHTML = `
    <div style="background: ${colors[type] || colors.info}; padding: 5px; margin-bottom: 10px; border-radius: 4px;">
      🐛 WHITE SCREEN DEBUGGER
    </div>
    ${debugLog.slice(-15).map(log => `<div>${log}</div>`).join('')}
  `;

  // Scroll to bottom
  debugOverlay.scrollTop = debugOverlay.scrollHeight;
}

// Track sessionStorage changes
const originalSetItem = sessionStorage.setItem;
const originalGetItem = sessionStorage.getItem;
const originalRemoveItem = sessionStorage.removeItem;

sessionStorage.setItem = function(key, value) {
  addDebugLog(`📦 sessionStorage.setItem('${key}', '${value}')`, 'info');
  return originalSetItem.call(this, key, value);
};

sessionStorage.getItem = function(key) {
  const value = originalGetItem.call(this, key);
  addDebugLog(`📦 sessionStorage.getItem('${key}') = '${value}'`, 'info');
  return value;
};

sessionStorage.removeItem = function(key) {
  addDebugLog(`📦 sessionStorage.removeItem('${key}')`, 'warn');
  return originalRemoveItem.call(this, key);
};

// Track tab changes
const tabbar = document.getElementById('main-tabbar');
if (tabbar) {
  addDebugLog('✅ Found main-tabbar', 'success');

  tabbar.addEventListener('prechange', function(event) {
    addDebugLog(`🔄 TAB PRECHANGE: index ${event.tabIndex}`, 'info');
  });

  tabbar.addEventListener('postchange', function(event) {
    addDebugLog(`🔄 TAB POSTCHANGE: index ${event.tabIndex}`, 'success');

    setTimeout(() => {
      // Check what content is visible
      const activePages = document.querySelectorAll('ons-page');
      let visiblePages = 0;
      let visibleContent = false;

      activePages.forEach((page, index) => {
        const computed = window.getComputedStyle(page);
        const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';
        const hasContent = page.innerHTML.trim().length > 100;

        if (isVisible) {
          visiblePages++;
          if (hasContent) {
            visibleContent = true;
          }
          addDebugLog(`📄 Page ${page.id || index}: visible=${isVisible}, hasContent=${hasContent}`, 'info');
        }
      });

      if (visiblePages === 0) {
        addDebugLog('❌ NO PAGES VISIBLE - WHITE SCREEN DETECTED!', 'error');
      } else if (!visibleContent) {
        addDebugLog('❌ PAGES VISIBLE BUT NO CONTENT - WHITE SCREEN!', 'error');
      } else {
        addDebugLog('✅ Content visible - no white screen', 'success');
      }
    }, 100);
  });
} else {
  addDebugLog('❌ main-tabbar NOT FOUND', 'error');
}

// Track page init events
document.addEventListener('init', function(event) {
  if (event.target.tagName === 'ONS-PAGE') {
    addDebugLog(`🎬 PAGE INIT: ${event.target.id}`, 'success');
  }
});

// Track template loading
const originalQuerySelector = document.querySelector;
document.querySelector = function(selector) {
  if (selector.startsWith('template#')) {
    const result = originalQuerySelector.call(this, selector);
    addDebugLog(`📋 Template query: ${selector} = ${result ? 'FOUND' : 'NOT FOUND'}`, result ? 'success' : 'error');
    return result;
  }
  return originalQuerySelector.call(this, selector);
};

// Track function calls
const originalFunctions = {};

// Track loadStartWorkoutPlans
if (typeof loadStartWorkoutPlans === 'function') {
  originalFunctions.loadStartWorkoutPlans = loadStartWorkoutPlans;
  window.loadStartWorkoutPlans = function(page) {
    addDebugLog(`🚀 loadStartWorkoutPlans() called with page: ${page?.id || 'undefined'}`, 'success');
    try {
      const result = originalFunctions.loadStartWorkoutPlans(page);
      addDebugLog(`✅ loadStartWorkoutPlans() completed`, 'success');
      return result;
    } catch (error) {
      addDebugLog(`❌ loadStartWorkoutPlans() ERROR: ${error.message}`, 'error');
      throw error;
    }
  };
}

// Track loadProgramsContent
if (typeof loadProgramsContent === 'function') {
  originalFunctions.loadProgramsContent = loadProgramsContent;
  window.loadProgramsContent = function() {
    addDebugLog(`🚀 loadProgramsContent() called`, 'success');
    try {
      const result = originalFunctions.loadProgramsContent();
      addDebugLog(`✅ loadProgramsContent() completed`, 'success');
      return result;
    } catch (error) {
      addDebugLog(`❌ loadProgramsContent() ERROR: ${error.message}`, 'error');
      throw error;
    }
  };
}

// Monitor errors
window.addEventListener('error', function(event) {
  addDebugLog(`💥 JS ERROR: ${event.message} at ${event.filename}:${event.lineno}`, 'error');
});

window.addEventListener('unhandledrejection', function(event) {
  addDebugLog(`💥 PROMISE ERROR: ${event.reason}`, 'error');
});

// Initial state check
addDebugLog('🔍 Checking initial state...', 'info');
const currentTargetTab = sessionStorage.getItem('targetTab');
if (currentTargetTab) {
  addDebugLog(`📦 Found targetTab on load: '${currentTargetTab}'`, 'warn');
} else {
  addDebugLog('📦 No targetTab found on load', 'info');
}

// Check active tabs
const activeTabs = document.querySelectorAll('ons-tab[active]');
addDebugLog(`🔍 Active tabs found: ${activeTabs.length}`, activeTabs.length > 0 ? 'success' : 'error');
activeTabs.forEach((tab, index) => {
  addDebugLog(`   Active tab ${index}: ${tab.id} (page: ${tab.getAttribute('page')})`, 'info');
});

// Check visible pages
const pages = document.querySelectorAll('ons-page');
addDebugLog(`🔍 Total pages found: ${pages.length}`, 'info');
pages.forEach((page, index) => {
  const computed = window.getComputedStyle(page);
  const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';
  if (isVisible) {
    addDebugLog(`   Visible page: ${page.id || index} (${page.innerHTML.length} chars)`, 'success');
  }
});

// Add manual test function
window.simulateBackButtonNavigation = function(fromTab = 'start') {
  addDebugLog(`🧪 SIMULATING BACK BUTTON: from=${fromTab}`, 'warn');

  // Step 1: Set sessionStorage (like goBack() does)
  sessionStorage.setItem('targetTab', fromTab);

  // Step 2: Reload page (like window.location.href = 'index.html' does)
  addDebugLog('🔄 Reloading page...', 'warn');
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

addDebugLog('🎯 DEBUG INJECTOR READY! Run simulateBackButtonNavigation("start") to test', 'success');
addDebugLog('📱 Navigate normally and watch for white screen detection', 'info');