// Deep analysis of main-tabbar and page routing relationship
// Paste this into browser console

console.log('🔬 DEEP TABBAR-PAGE ANALYSIS');
console.log('===================================');

// Get references
const tabbar = document.getElementById('main-tabbar');
const tabs = tabbar ? tabbar.querySelectorAll('ons-tab') : [];

console.log('\n📊 INITIAL STATE ANALYSIS');
console.log('Tabbar found:', tabbar ? '✅' : '❌');
console.log('Tab count:', tabs.length);

if (tabbar) {
  console.log('Current active tab index:', tabbar.getActiveTabIndex());

  tabs.forEach((tab, index) => {
    console.log(`Tab ${index}: ${tab.id}`);
    console.log(`  Label: ${tab.getAttribute('label')}`);
    console.log(`  Page: ${tab.getAttribute('page')}`);
    console.log(`  Has active attr: ${tab.hasAttribute('active')}`);
    console.log(`  CSS classes: ${tab.className}`);
  });
}

// Check all pages and their relationship to tabs
console.log('\n📄 PAGE-TAB RELATIONSHIP ANALYSIS');
const pages = document.querySelectorAll('ons-page');
console.log('Total pages found:', pages.length);

pages.forEach((page, index) => {
  const computed = window.getComputedStyle(page);
  const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';

  console.log(`\nPage ${index}: ${page.id || 'no-id'}`);
  console.log(`  Visible: ${isVisible}`);
  console.log(`  Display: ${computed.display}`);
  console.log(`  Visibility: ${computed.visibility}`);
  console.log(`  Opacity: ${computed.opacity}`);
  console.log(`  Z-index: ${computed.zIndex}`);

  // Try to find which tab corresponds to this page
  const matchingTab = Array.from(tabs).find(tab => {
    const tabPage = tab.getAttribute('page');
    return (
      (page.id === 'start-tab-page' && tabPage === 'start.html') ||
      (page.id === 'programs-page' && tabPage === 'programs.html') ||
      (page.id === 'glossary-page' && tabPage === 'glossary.html') ||
      (tabPage === 'index.html' && !page.id.includes('-tab-page') && !page.id.includes('-page'))
    );
  });

  if (matchingTab) {
    console.log(`  ↔️ Matches tab: ${matchingTab.id} (${matchingTab.getAttribute('page')})`);
    console.log(`  ↔️ Tab is active: ${matchingTab.hasAttribute('active')}`);
  } else {
    console.log(`  ❓ No matching tab found`);
  }
});

// Deep dive into tabbar internal state
console.log('\n🧠 TABBAR INTERNAL STATE');
if (tabbar) {
  console.log('Tabbar element:', tabbar);
  console.log('Tabbar innerHTML preview:', tabbar.innerHTML.substring(0, 200) + '...');

  // Check for Onsen UI internal properties
  const onsenTab = tabbar._onsenTab || tabbar.__onsenTab;
  if (onsenTab) {
    console.log('Onsen internal tab object found');
    console.log('Internal active tab:', onsenTab.getActiveTabIndex ? onsenTab.getActiveTabIndex() : 'method not found');
  }

  // Check tabbar's current page management
  try {
    const loadedPages = tabbar.getPages ? tabbar.getPages() : 'getPages method not found';
    console.log('Tabbar loaded pages:', loadedPages);
  } catch (error) {
    console.log('Error getting tabbar pages:', error.message);
  }
}

// Test the setActiveTab behavior step by step
function deepTestTabSwitch(targetIndex, targetTab) {
  console.log(`\n🧪 DEEP TEST: Switching to ${targetTab} (index ${targetIndex})`);

  console.log('\n--- BEFORE SWITCH ---');
  console.log('Active tab index:', tabbar.getActiveTabIndex());

  tabs.forEach((tab, index) => {
    console.log(`Tab ${index} ${tab.id}: active=${tab.hasAttribute('active')}`);
  });

  pages.forEach((page, index) => {
    const computed = window.getComputedStyle(page);
    const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';
    if (page.id) {
      console.log(`Page ${page.id}: visible=${isVisible}, display=${computed.display}, visibility=${computed.visibility}`);
    }
  });

  console.log('\n--- EXECUTING SWITCH ---');
  try {
    tabbar.setActiveTab(targetIndex, {animation: 'none'});
    console.log('✅ setActiveTab called successfully');
  } catch (error) {
    console.log('❌ setActiveTab failed:', error);
    return;
  }

  setTimeout(() => {
    console.log('\n--- AFTER SWITCH (immediate) ---');
    console.log('Active tab index:', tabbar.getActiveTabIndex());

    tabs.forEach((tab, index) => {
      console.log(`Tab ${index} ${tab.id}: active=${tab.hasAttribute('active')}`);
    });

    setTimeout(() => {
      console.log('\n--- AFTER SWITCH (100ms delay) ---');
      console.log('Active tab index:', tabbar.getActiveTabIndex());

      pages.forEach((page, index) => {
        const computed = window.getComputedStyle(page);
        const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';
        if (page.id) {
          console.log(`Page ${page.id}: visible=${isVisible}, display=${computed.display}, visibility=${computed.visibility}`);
        }
      });

      // Check if the expected page is actually visible
      const expectedPages = {
        0: null, // Home - multiple possible pages
        1: 'start-tab-page',
        2: 'programs-page',
        3: 'glossary-page'
      };

      const expectedPageId = expectedPages[targetIndex];
      if (expectedPageId) {
        const expectedPage = document.getElementById(expectedPageId);
        if (expectedPage) {
          const computed = window.getComputedStyle(expectedPage);
          const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';

          console.log(`\n🎯 EXPECTED PAGE CHECK:`);
          console.log(`Expected page: ${expectedPageId}`);
          console.log(`Page visible: ${isVisible}`);
          console.log(`Tab indicator shows index: ${tabbar.getActiveTabIndex()}`);

          if (isVisible && tabbar.getActiveTabIndex() === targetIndex) {
            console.log('✅ TAB AND PAGE ARE ALIGNED');
          } else {
            console.log('❌ TAB AND PAGE ARE MISALIGNED');
            console.log('  Tab indicator:', tabbar.getActiveTabIndex(), 'Expected:', targetIndex);
            console.log('  Page visible:', isVisible, 'Expected: true');
          }
        }
      }
    }, 100);
  }, 10);
}

// Simulate the back button navigation scenario
function simulateBackButtonNavigation() {
  console.log('\n🎭 SIMULATING BACK BUTTON NAVIGATION');
  console.log('Scenario: Start Tab → Program → Back Button');

  console.log('\n1. Setting sessionStorage (simulating goBack())');
  sessionStorage.setItem('targetTab', 'start');

  console.log('\n2. Simulating inline script execution');
  const targetTab = sessionStorage.getItem('targetTab');
  console.log('Read targetTab from storage:', targetTab);

  // Clear it like the real script does
  sessionStorage.removeItem('targetTab');

  // Set active attribute like the real script
  const startTab = document.getElementById('start-tab');
  if (startTab) {
    // Clear all active attributes first
    tabs.forEach(tab => tab.removeAttribute('active'));
    startTab.setAttribute('active', '');
    console.log('✅ Set start-tab active attribute');

    // Store pending load
    sessionStorage.setItem('pendingContentLoad', 'start');

    // Execute the visibility and tab alignment fix
    setTimeout(() => {
      console.log('\n3. Executing visibility and tab alignment fix');

      const startPage = document.getElementById('start-tab-page');
      if (startPage) {
        startPage.style.visibility = 'visible';
        startPage.style.opacity = '1';
        startPage.style.display = 'block';
        console.log('✅ Fixed Start page visibility');
      }

      if (tabbar && typeof tabbar.setActiveTab === 'function') {
        try {
          tabbar.setActiveTab(1, {animation: 'none'}); // Start tab is index 1
          console.log('✅ Called setActiveTab(1)');

          setTimeout(() => {
            console.log('\n4. Final state check:');
            console.log('Tab indicator index:', tabbar.getActiveTabIndex());
            console.log('Start page visible:', window.getComputedStyle(startPage).visibility === 'visible');

            if (tabbar.getActiveTabIndex() === 1 && window.getComputedStyle(startPage).visibility === 'visible') {
              console.log('✅ SIMULATION SUCCESS: Tab and page aligned');
            } else {
              console.log('❌ SIMULATION FAILED: Still misaligned');
            }
          }, 100);
        } catch (error) {
          console.log('❌ setActiveTab failed:', error);
        }
      }
    }, 100);
  }
}

// Expose functions
window.deepTestTabSwitch = deepTestTabSwitch;
window.simulateBackButtonNavigation = simulateBackButtonNavigation;

console.log('\n🎯 AVAILABLE TESTS:');
console.log('deepTestTabSwitch(1, "start") - Test switching to Start tab');
console.log('simulateBackButtonNavigation() - Simulate the back button flow');