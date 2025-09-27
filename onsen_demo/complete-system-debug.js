// COMPLETE SYSTEM DEBUG - Trace all back button issues
// Paste into console to monitor the entire back button flow

console.log('🚨 COMPLETE SYSTEM DEBUG ACTIVATED');
console.log('==================================');

// 1. Monitor sessionStorage changes
const originalSetItem = sessionStorage.setItem;
const originalGetItem = sessionStorage.getItem;
const originalRemoveItem = sessionStorage.removeItem;

sessionStorage.setItem = function(key, value) {
  console.log(`🗄️ sessionStorage.setItem('${key}', '${value}')`);
  return originalSetItem.call(this, key, value);
};

sessionStorage.getItem = function(key) {
  const value = originalGetItem.call(this, key);
  console.log(`🗄️ sessionStorage.getItem('${key}') → '${value}'`);
  return value;
};

sessionStorage.removeItem = function(key) {
  console.log(`🗄️ sessionStorage.removeItem('${key}')`);
  return originalRemoveItem.call(this, key);
};

// 2. Monitor all DOM changes to pages
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const target = mutation.target;
      if (target.tagName === 'ONS-PAGE' && target.id) {
        const style = window.getComputedStyle(target);
        console.log(`🎨 Page style change: ${target.id} → display:${style.display}, visibility:${style.visibility}`);
      }
    }
  });
});

// Start observing
document.querySelectorAll('ons-page').forEach(page => {
  observer.observe(page, { attributes: true, attributeFilter: ['style'] });
});

// 3. Monitor tabbar state changes
const tabbar = document.getElementById('main-tabbar');
if (tabbar) {
  const originalSetActiveTab = tabbar.setActiveTab;
  tabbar.setActiveTab = function(index, options) {
    console.log(`📱 tabbar.setActiveTab(${index}, ${JSON.stringify(options)})`);
    console.log(`   Before: active index = ${this.getActiveTabIndex()}`);

    const result = originalSetActiveTab.call(this, index, options);

    setTimeout(() => {
      console.log(`   After: active index = ${this.getActiveTabIndex()}`);

      // Check page visibility after tab change
      const pages = document.querySelectorAll('ons-page');
      let visibleCount = 0;
      pages.forEach(page => {
        const style = window.getComputedStyle(page);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
        if (isVisible && page.id) {
          visibleCount++;
          console.log(`   👁️ Visible page: ${page.id}`);
        }
      });

      if (visibleCount === 0) {
        console.log('🚨 NO PAGES VISIBLE - WHITE SCREEN DETECTED!');

        // Try to diagnose what went wrong
        console.log('🔍 Diagnosing white screen...');
        pages.forEach(page => {
          if (page.id) {
            const style = window.getComputedStyle(page);
            console.log(`   ${page.id}: display=${style.display}, visibility=${style.visibility}, opacity=${style.opacity}`);
          }
        });
      }
    }, 10);

    return result;
  };
}

// 4. Monitor ons.ready calls
if (typeof ons !== 'undefined') {
  const originalReady = ons.ready;
  ons.ready = function(callback) {
    console.log('🚀 ons.ready() called');
    return originalReady.call(this, function() {
      console.log('✅ ons.ready() callback executing');
      return callback();
    });
  };
}

// 5. Monitor DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOMContentLoaded fired');
});

// 6. Monitor function calls
const functionsToMonitor = [
  'loadStartWorkoutPlans',
  'loadProgramsContent',
  'processPendingContentLoad'
];

functionsToMonitor.forEach(funcName => {
  if (typeof window[funcName] === 'function') {
    const originalFunc = window[funcName];
    window[funcName] = function(...args) {
      console.log(`🎯 ${funcName}() called with:`, args);
      try {
        const result = originalFunc.apply(this, args);
        console.log(`✅ ${funcName}() completed`);
        return result;
      } catch (error) {
        console.log(`❌ ${funcName}() failed:`, error);
        throw error;
      }
    };
  } else {
    console.log(`⚠️ Function ${funcName} not found`);
  }
});

// 7. Current state snapshot
console.log('\n📊 CURRENT STATE SNAPSHOT:');
console.log('sessionStorage keys:', Object.keys(sessionStorage));
Object.keys(sessionStorage).forEach(key => {
  console.log(`  ${key}: ${sessionStorage.getItem(key)}`);
});

if (tabbar) {
  console.log('Tabbar active index:', tabbar.getActiveTabIndex());

  const tabs = tabbar.querySelectorAll('ons-tab');
  tabs.forEach((tab, index) => {
    console.log(`Tab ${index} (${tab.id}): active=${tab.hasAttribute('active')}, classes="${tab.className}"`);
  });
}

const pages = document.querySelectorAll('ons-page');
console.log(`Total pages: ${pages.length}`);
pages.forEach((page, index) => {
  if (page.id) {
    const style = window.getComputedStyle(page);
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
    console.log(`Page ${index} (${page.id}): visible=${isVisible}, display=${style.display}, visibility=${style.visibility}`);
  }
});

// 8. Simulate back button flow for testing
window.debugBackButton = function() {
  console.log('\n🧪 SIMULATING BACK BUTTON FLOW');
  console.log('1. Setting targetTab=start (like goBack() does)');
  sessionStorage.setItem('targetTab', 'start');

  console.log('2. Reloading page (like window.location.href = "index.html" does)');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

console.log('\n🎯 MONITORING ACTIVE - Back button flow will be traced');
console.log('🧪 Run debugBackButton() to simulate the back button');
console.log('📱 Or use the actual back button and watch the console');

// 9. Monitor errors
window.addEventListener('error', function(e) {
  console.log('💥 JavaScript Error:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    stack: e.error?.stack
  });
});

window.addEventListener('unhandledrejection', function(e) {
  console.log('💥 Promise Rejection:', e.reason);
});

console.log('🔍 Complete system debugging is now active!');