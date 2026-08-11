/**
 * Automated Tests for Theme Settings & Storage Persistence
 */

import { StorageManager } from '../js/storage.js';

// Polyfill localStorage in node environment if needed
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

function runThemeTests() {
  console.log('🧪 Starting Theme & Settings Storage Tests...\n');

  let passed = 0;
  let failed = 0;

  function assertEqual(actual, expected, testName) {
    if (actual === expected) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      console.error(`     Expected: "${expected}", Got: "${actual}"`);
      failed++;
    }
  }

  // Test 1: Default settings fallback
  console.log('--- Test Suite 1: Default Settings Fallback ---');
  StorageManager.saveSettings({}); // reset
  localStorage.removeItem('land_calc_settings');
  const defaultSettings = StorageManager.getSettings();
  assertEqual(defaultSettings.theme, 'dark', 'Default theme setting is "dark"');

  // Test 2: Save and retrieve light theme
  console.log('\n--- Test Suite 2: Save and Retrieve Light Theme ---');
  StorageManager.saveSettings({ theme: 'light' });
  const lightSettings = StorageManager.getSettings();
  assertEqual(lightSettings.theme, 'light', 'Retrieved saved theme is "light"');

  // Test 3: Toggle back to dark theme
  console.log('\n--- Test Suite 3: Toggle Back to Dark Theme ---');
  StorageManager.saveSettings({ theme: 'dark' });
  const darkSettings = StorageManager.getSettings();
  assertEqual(darkSettings.theme, 'dark', 'Retrieved saved theme is "dark"');

  console.log(`\n========================================`);
  console.log(`Theme & Storage Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runThemeTests();
