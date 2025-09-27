// Fixed Architecture debugging script - paste into browser console

console.log('🏗️ ARCHITECTURE DEBUG - Analyzing navigation structure');

// Check the navigator setup (fix variable naming conflict)
const onsNavigator = document.getElementById('navigator');
console.log('📍 Navigator:', onsNavigator ? '✅ Found' : '❌ Missing');
if (onsNavigator) {
  try {
    console.log('   Current page:', onsNavigator.getCurrentPage()?.id || 'Unknown');
    console.log('   Page stack length:', onsNavigator.getPages().length);
  } catch (error) {
    console.log('   Navigator methods error:', error.message);
  }
}

// Check the tabbar
const tabbar = document.getElementById('main-tabbar');
console.log('📍 Tabbar:', tabbar ? '✅ Found' : '❌ Missing');
if (tabbar) {
  console.log('   Active tab index:', tabbar.getActiveTabIndex());
  console.log('   Tab count:', tabbar.querySelectorAll('ons-tab').length);

  // Check each tab
  const tabs = tabbar.querySelectorAll('ons-tab');
  tabs.forEach((tab, index) => {
    console.log(`   Tab ${index}: ${tab.id} (page: ${tab.getAttribute('page')}) ${tab.hasAttribute('active') ? '👑 ACTIVE' : ''}`);
  });
}

// Check templates
const expectedTemplates = ['home.html', 'index.html', 'start.html', 'programs.html', 'glossary.html'];
console.log('📋 Templates:');
expectedTemplates.forEach(templateId => {
  const template = document.querySelector(`template#${templateId.replace('.html', '')}`);
  console.log(`   ${templateId}: ${template ? '✅ Found' : '❌ Missing'}`);
});

// Check what pages are currently visible
console.log('👁️ Visible Pages:');
const pages = document.querySelectorAll('ons-page');
let visiblePageCount = 0;
pages.forEach((page, index) => {
  const computed = window.getComputedStyle(page);
  const isVisible = computed.display !== 'none' && computed.visibility !== 'hidden';
  if (isVisible || page.hasAttribute('active')) {
    visiblePageCount++;
    console.log(`   Page ${index}: ${page.id || 'no-id'} - display:${computed.display}, visible:${isVisible}, active:${page.hasAttribute('active')}`);
    console.log(`      Content length: ${page.innerHTML.length} chars`);

    // Check if this page has meaningful content
    const hasContent = page.innerHTML.length > 500; // More than just basic structure
    const hasVisibleContent = computed.visibility !== 'hidden' && computed.display !== 'none';
    console.log(`      Has content: ${hasContent}, Truly visible: ${hasVisibleContent}`);
  }
});

console.log(`📊 Summary: ${visiblePageCount} visible pages found`);

// Manual tab switching test
function testTabSwitch(tabIndex) {
  console.log(`\n🧪 TESTING TAB SWITCH to index ${tabIndex}`);

  if (!tabbar) {
    console.log('❌ No tabbar found');
    return;
  }

  console.log('Before switch:');
  console.log('   Active tab:', tabbar.getActiveTabIndex());

  try {
    tabbar.setActiveTab(tabIndex, {animation: 'none'});
    console.log('✅ setActiveTab called');

    setTimeout(() => {
      console.log('After switch (100ms delay):');
      console.log('   Active tab:', tabbar.getActiveTabIndex());

      const visiblePages = Array.from(document.querySelectorAll('ons-page')).filter(p => {
        const style = window.getComputedStyle(p);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      console.log('   Visible pages:', visiblePages.length);
      visiblePages.forEach(page => {
        console.log(`      ${page.id}: ${page.innerHTML.length} chars`);
      });

      if (visiblePages.length === 0 || visiblePages.every(p => p.innerHTML.length < 100)) {
        console.log('❌ WHITE SCREEN DETECTED!');
      } else {
        console.log('✅ Content is visible');
      }
    }, 100);

  } catch (error) {
    console.log('❌ setActiveTab failed:', error);
  }
}

// Test the theory: manually set active attribute vs setActiveTab
function testActiveAttribute() {
  console.log('\n🧪 TESTING ACTIVE ATTRIBUTE vs setActiveTab');

  const tabs = document.querySelectorAll('ons-tab');

  // Clear all active attributes
  tabs.forEach(tab => tab.removeAttribute('active'));

  // Set start tab active manually
  const startTab = document.getElementById('start-tab');
  if (startTab) {
    startTab.setAttribute('active', '');
    console.log('✅ Set start-tab active attribute manually');

    setTimeout(() => {
      const visiblePages = Array.from(document.querySelectorAll('ons-page')).filter(p => {
        const style = window.getComputedStyle(p);
        return style.display !== 'none';
      });
      console.log('Pages after manual active:', visiblePages.map(p => p.id));

      if (visiblePages.length === 0) {
        console.log('❌ MANUAL ACTIVE ATTRIBUTE CAUSES WHITE SCREEN!');
      } else {
        console.log('✅ Manual active attribute works');
      }
    }, 100);
  }
}

// Expose test functions globally
window.testTabSwitch = testTabSwitch;
window.testActiveAttribute = testActiveAttribute;

console.log('\n🎯 Run testTabSwitch(1) to test switching to Start tab');
console.log('🎯 Run testActiveAttribute() to test manual active setting');
console.log('🎯 Tab indices: 0=Home, 1=Start, 2=Programs, 3=Glossary');