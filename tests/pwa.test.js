/**
 * Automated PWA & Offline Compliance Test Suite
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function runPwaTests() {
  console.log('🧪 Starting PWA & Offline Compliance Automated Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // Test 1: Check Manifest.json existence and structure
  console.log('--- Test Suite 1: Web App Manifest Integrity ---');
  const manifestPath = path.join(projectRoot, 'manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json exists');

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(Boolean(manifest.name), 'manifest has name property');
    assert(Boolean(manifest.short_name), 'manifest has short_name property');
    assert(manifest.display === 'standalone', 'display mode is standalone');
    assert(manifest.start_url === './index.html' || manifest.start_url === 'index.html', 'start_url is set to index.html');
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'manifest includes at least 2 icon sizes (192x192 and 512x512)');
  }

  // Test 2: Check Service Worker registration & cached assets
  console.log('\n--- Test Suite 2: Service Worker Cache Coverage ---');
  const swPath = path.join(projectRoot, 'sw.js');
  assert(fs.existsSync(swPath), 'sw.js exists');

  if (fs.existsSync(swPath)) {
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert(swContent.includes('CACHE_NAME'), 'sw.js defines CACHE_NAME');
    assert(swContent.includes('ASSETS_TO_CACHE'), 'sw.js defines ASSETS_TO_CACHE list');
    assert(swContent.includes('./index.html'), 'sw.js caches index.html');
    assert(swContent.includes('./css/styles.css'), 'sw.js caches styles.css');
    assert(swContent.includes('./js/app.js'), 'sw.js caches app.js');
    assert(swContent.includes('./js/calculator.js'), 'sw.js caches calculator.js');
    assert(swContent.includes('./js/storage.js'), 'sw.js caches storage.js');
    assert(swContent.includes('fetch'), 'sw.js handles fetch event for offline support');
  }

  // Test 3: Check index.html and app.js PWA tags
  console.log('\n--- Test Suite 3: HTML PWA & Meta Tag Standard ---');
  const indexPath = path.join(projectRoot, 'index.html');
  const appJsPath = path.join(projectRoot, 'js', 'app.js');
  assert(fs.existsSync(indexPath), 'index.html exists');

  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const appJsContent = fs.existsSync(appJsPath) ? fs.readFileSync(appJsPath, 'utf8') : '';
    assert(indexContent.includes('<meta name="viewport"'), 'index.html includes viewport meta tag');
    assert(indexContent.includes('<meta name="theme-color"'), 'index.html includes theme-color meta tag');
    assert(indexContent.includes('<link rel="manifest" href="./manifest.json">'), 'index.html links to manifest.json');
    assert(indexContent.includes('serviceWorker') || appJsContent.includes('serviceWorker'), 'index.html or imported app.js registers service worker');
  }

  console.log(`\n========================================`);
  console.log(`PWA Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPwaTests();
