/**
 * Land Calculator PWA - Main App Controller
 * Manages PWA registration, tab dock navigation, offline indicator, and install prompt.
 */

import { StorageManager } from './storage.js';
import { CalculatorEngine } from './calculator.js';

let deferredPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initTabNavigation();
  initNetworkStatus();
  initInstallPrompt();
  
  console.log('Land Calculator PWA initialized.', CalculatorEngine.info());
});

/**
 * 1. Register Service Worker for 100% Offline PWA Capability
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    });
  }
}

/**
 * 2. Bottom Dock Navigation Tab Switcher
 */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const viewPanels = document.querySelectorAll('.view-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetViewId = btn.getAttribute('data-tab');

      // Update tab button active states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update view panel active states
      viewPanels.forEach(panel => {
        if (panel.id === targetViewId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/**
 * 3. Network Status Handler (Online / Offline banner)
 */
function initNetworkStatus() {
  const banner = document.getElementById('offlineBanner');
  
  function updateOnlineStatus() {
    if (!navigator.onLine) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

/**
 * 4. PWA Install Prompt Handler
 */
function initInstallPrompt() {
  const installBtn = document.getElementById('installPwaBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    installBtn.style.display = 'none';
  });
}
