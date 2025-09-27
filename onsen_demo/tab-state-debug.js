// Tab state debugging - paste into console after back navigation issue occurs

console.log('🔍 TAB STATE DIAGNOSTIC');
console.log('========================');

const tabbar = document.getElementById('main-tabbar');
const tabs = tabbar ? tabbar.querySelectorAll('ons-tab') : [];

console.log('\n📊 CURRENT TAB STATE:');
console.log('Tabbar active index:', tabbar ? tabbar.getActiveTabIndex() : 'No tabbar');

tabs.forEach((tab, index) => {
  console.log(`\nTab ${index} (${tab.id}):`);
  console.log(`  Has 'active' attribute: ${tab.hasAttribute('active')}`);
  console.log(`  CSS classes: "${tab.className}"`);
  console.log(`  Is clickable: ${!tab.hasAttribute('disabled')}`);
  console.log(`  Style display: ${tab.style.display || 'default'}`);
  console.log(`  Computed pointer-events: ${window.getComputedStyle(tab).pointerEvents}`);

  // Check if tab is actually clickable
  const rect = tab.getBoundingClientRect();
  const isVisible = rect.width > 0 && rect.height > 0;
  console.log(`  Visual size: ${rect.width}x${rect.height} (visible: ${isVisible})`);
});

console.log('\n🎯 EXPECTED vs ACTUAL:');
console.log('Expected: Start tab (index 1) should be active and clickable');
console.log('Actual findings:');

// Check what should be active vs what is active
const startTab = document.getElementById('start-tab');
const homeTab = document.getElementById('home-tab');

if (startTab && homeTab) {
  console.log(`Start tab active attribute: ${startTab.hasAttribute('active')}`);
  console.log(`Home tab active attribute: ${homeTab.hasAttribute('active')}`);
  console.log(`Start tab CSS classes: "${startTab.className}"`);
  console.log(`Home tab CSS classes: "${homeTab.className}"`);

  console.log('\n🔧 IMMEDIATE FIXES TO TRY:');

  // Test fix 1: Clear all active states and set Start properly
  window.fixTabState = function() {
    console.log('Attempting to fix tab state...');

    // Clear all active attributes
    tabs.forEach(tab => {
      tab.removeAttribute('active');
      tab.classList.remove('active');
    });

    // Set Start tab as active
    startTab.setAttribute('active', '');
    startTab.classList.add('active');

    // Force tabbar to recognize the change
    if (tabbar && typeof tabbar.setActiveTab === 'function') {
      tabbar.setActiveTab(1, {animation: 'none'});
    }

    console.log('Fix attempted. Check if Start tab is now clickable.');
  };

  // Test fix 2: Force click handler reset
  window.forceTabReset = function() {
    console.log('Force resetting tab handlers...');

    // Remove any disabled attributes
    tabs.forEach(tab => {
      tab.removeAttribute('disabled');
      tab.style.pointerEvents = '';
    });

    // Manually trigger the tab
    startTab.click();

    console.log('Force reset completed.');
  };

  console.log('\nRun fixTabState() or forceTabReset() to attempt fixes');
}

// Check if there are any error states
console.log('\n⚠️  ERROR STATE CHECKS:');
console.log('Window._isBackNavigation:', window._isBackNavigation);
console.log('PendingContentLoad in storage:', sessionStorage.getItem('pendingContentLoad'));
console.log('TargetTab in storage:', sessionStorage.getItem('targetTab'));

// Check for JavaScript errors
console.log('\n🐛 ERROR MONITORING:');
const originalConsoleError = console.error;
let errorCount = 0;

console.error = function(...args) {
  errorCount++;
  console.log(`🚨 Error ${errorCount}:`, ...args);
  originalConsoleError.apply(console, args);
};

console.log('Error monitoring enabled. Any new errors will be highlighted.');