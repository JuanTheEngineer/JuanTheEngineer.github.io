// Architecture Validation Script
// Paste this into browser console to validate the new pure tabbar architecture

console.log('🏗️ ARCHITECTURE VALIDATION');
console.log('===========================');

// 1. Check for old problematic navigator structure
const navigator = document.getElementById('navigator');
console.log('🔍 Old navigator element:', navigator ? '❌ STILL EXISTS (bad)' : '✅ REMOVED (good)');

// 2. Check for pure tabbar structure
const tabbar = document.getElementById('main-tabbar');
console.log('🔍 Main tabbar:', tabbar ? '✅ FOUND' : '❌ MISSING');

if (tabbar) {
  const tabs = tabbar.querySelectorAll('ons-tab');
  console.log('   Tab count:', tabs.length);
  console.log('   Current active index:', tabbar.getActiveTabIndex());

  tabs.forEach((tab, index) => {
    console.log(`   Tab ${index}: ${tab.id} → ${tab.getAttribute('page')}`);
  });
}

// 3. Check templates structure
const templates = ['home.html', 'start.html', 'programs.html', 'glossary.html'];
console.log('🔍 Template structure:');
templates.forEach(templateId => {
  const template = document.querySelector(`template#${templateId.replace('.html', '')}`);
  console.log(`   ${templateId}:`, template ? '✅ FOUND' : '❌ MISSING');

  if (template) {
    const page = template.querySelector('ons-page');
    console.log(`     Has ons-page:`, page ? '✅' : '❌');
    if (page && page.id) {
      console.log(`     Page ID: ${page.id}`);
    }
  }
});

// 4. Test tab switching functionality
window.testTabSwitching = function() {
  console.log('\n🧪 TESTING TAB SWITCHING');
  console.log('========================');

  if (!tabbar) {
    console.log('❌ No tabbar found');
    return;
  }

  // Test each tab
  [1, 2, 3, 0].forEach((index, testIndex) => {
    setTimeout(() => {
      console.log(`\nTest ${testIndex + 1}: Switching to tab index ${index}`);

      try {
        const beforeIndex = tabbar.getActiveTabIndex();
        tabbar.setActiveTab(index, {animation: 'none'});

        setTimeout(() => {
          const afterIndex = tabbar.getActiveTabIndex();
          console.log(`   Before: ${beforeIndex}, After: ${afterIndex}`);

          if (afterIndex === index) {
            console.log('   ✅ Tab switch successful');
          } else {
            console.log('   ❌ Tab switch failed');
          }

          // Check for visible pages
          const pages = document.querySelectorAll('ons-page');
          let visibleCount = 0;
          pages.forEach(page => {
            const style = window.getComputedStyle(page);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
              visibleCount++;
            }
          });

          console.log(`   Visible pages: ${visibleCount}`);
          if (visibleCount === 0) {
            console.log('   🚨 WHITE SCREEN DETECTED!');
          }

        }, 100);

      } catch (error) {
        console.log('   ❌ Error during tab switch:', error);
      }
    }, testIndex * 1000);
  });
};

// 5. Test back navigation simulation
window.testBackNavigation = function() {
  console.log('\n🔄 TESTING BACK NAVIGATION SIMULATION');
  console.log('=====================================');

  console.log('1. Setting targetTab=start (simulating back from program)');
  sessionStorage.setItem('targetTab', 'start');

  console.log('2. Reloading page to test back navigation flow');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

// 6. Current state check
console.log('\n📊 CURRENT STATE:');
console.log('==================');
console.log('Document ready state:', document.readyState);
console.log('Onsen UI loaded:', typeof ons !== 'undefined');
console.log('sessionStorage keys:', Object.keys(sessionStorage));

Object.keys(sessionStorage).forEach(key => {
  console.log(`   ${key}: ${sessionStorage.getItem(key)}`);
});

console.log('\n🎯 AVAILABLE TESTS:');
console.log('testTabSwitching() - Test all tab switches');
console.log('testBackNavigation() - Simulate back button navigation');
console.log('\n✅ Architecture validation complete!');