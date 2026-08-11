/**
 * Land Calculator PWA - Main App Controller & UI Handler
 */

import { StorageManager } from './storage.js';
import { CalculatorEngine } from './calculator.js';

// Application State
const state = {
  inputBuffer: '0',
  expression: '',
  parcelsList: [],
  isEvaluated: false,
  lastResult: null
};

let deferredPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initNetworkStatus();
  initInstallPrompt();

  initCalculatorUI();
  initKeyboardSupport();

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
          reg.update();
          console.log('[PWA] Service Worker registered and updated scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    });
  }
}

/**
 * 2. Network Status Handler (Online / Offline banner)
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
 * 3. PWA Install Prompt Handler
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

/**
 * 4. Phone Calculator Interactive UI
 */
function initCalculatorUI() {
  const keypad = document.querySelector('.keypad-grid');
  const clearParcelsBtn = document.getElementById('clearParcelsBtn');

  if (keypad) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.key-btn');
      if (!btn) return;

      const key = btn.getAttribute('data-key');
      triggerHaptic();

      if (key) {
        handleKeyInput(key);
      }
    });
  }

  if (clearParcelsBtn) {
    clearParcelsBtn.addEventListener('click', () => {
      triggerHaptic();
      state.parcelsList = [];
      state.inputBuffer = '0';
      state.isEvaluated = false;
      updateDisplayUI();
      updateParcelsListUI();
    });
  }

  updateDisplayUI();
  updateParcelsListUI();
}

/**
 * Handle Keypad Inputs
 */
function handleKeyInput(key) {
  switch (key) {
    case 'AC':
      state.inputBuffer = '0';
      state.expression = '';
      state.parcelsList = [];
      state.isEvaluated = false;
      state.lastResult = null;
      updateDisplayUI();
      updateParcelsListUI();
      return;

    case 'DEL':
      if (state.isEvaluated) {
        state.isEvaluated = false;
      }
      if (state.inputBuffer.length > 1) {
        state.inputBuffer = state.inputBuffer.slice(0, -1);
      } else {
        state.inputBuffer = '0';
      }
      break;

    case 'ADD_PARCEL':
    case '+':
      addCurrentInputAsParcel();
      state.isEvaluated = false;
      break;

    case '=':
      if (state.inputBuffer !== '0' && state.inputBuffer !== '') {
        addCurrentInputAsParcel();
      }
      state.isEvaluated = true;
      break;

    case 'SAVE':
      saveCurrentCalculation();
      return;

    case '.':
      if (state.isEvaluated) {
        state.inputBuffer = '0.';
        state.isEvaluated = false;
      } else if (!state.inputBuffer.includes('.')) {
        state.inputBuffer += '.';
      }
      break;

    case '00':
      if (state.isEvaluated) {
        state.inputBuffer = '0';
        state.isEvaluated = false;
      }
      if (state.inputBuffer !== '0') {
        state.inputBuffer += '00';
      }
      break;

    default: // Digits 0-9
      if (/^[0-9]$/.test(key)) {
        if (state.isEvaluated) {
          state.inputBuffer = key;
          state.isEvaluated = false;
        } else if (state.inputBuffer === '0') {
          state.inputBuffer = key;
        } else {
          state.inputBuffer += key;
        }
      }
      break;
  }

  updateDisplayUI();
}

/**
 * Add the current entered land size in the display buffer into the active parcels list
 */
function addCurrentInputAsParcel() {
  const val = state.inputBuffer.trim();
  if (val && val !== '0' && !isNaN(Number(val))) {
    state.parcelsList.push(val);
    state.inputBuffer = '0';
    updateParcelsListUI();
  }
}

/**
 * Update Digital Calculator Screen Display
 */
function updateDisplayUI() {
  const calcExpression = document.getElementById('calcExpression');
  const calcDisplay = document.getElementById('calcDisplay');
  const calcHumanText = document.getElementById('calcHumanText');
  const calcSqFt = document.getElementById('calcSqFt');
  const calcSqYards = document.getElementById('calcSqYards');

  const summaryResult = CalculatorEngine.calculateSum(state.parcelsList);

  if (state.isEvaluated || state.inputBuffer === '0') {
    // Evaluated state or idle state: show total calculated land sum
    if (state.parcelsList.length > 0) {
      calcExpression.textContent = `${state.parcelsList.join(' + ')}${state.isEvaluated ? ' =' : ' +'}`;
      calcDisplay.textContent = summaryResult.total.formattedCode;
      calcHumanText.textContent = summaryResult.total.humanText;
      calcSqFt.textContent = summaryResult.total.conversions.totalSqFt.toLocaleString();
      calcSqYards.textContent = summaryResult.total.conversions.totalSqYards.toLocaleString();
    } else {
      calcExpression.textContent = '0';
      calcDisplay.textContent = '0';
      calcHumanText.textContent = '0 Acres, 0 Guntas';
      calcSqFt.textContent = '0';
      calcSqYards.textContent = '0';
    }
  } else {
    // User is actively typing a new parcel number
    const cents = CalculatorEngine.parseLandInputToCents(state.inputBuffer);
    const decoded = CalculatorEngine.decodeCentsToLand(cents);

    if (state.parcelsList.length > 0) {
      calcExpression.textContent = `${state.parcelsList.join(' + ')} + ${state.inputBuffer}`;
    } else {
      calcExpression.textContent = state.inputBuffer;
    }

    calcDisplay.textContent = state.inputBuffer;
    calcHumanText.textContent = decoded.humanText;
    calcSqFt.textContent = decoded.conversions.totalSqFt.toLocaleString();
    calcSqYards.textContent = decoded.conversions.totalSqYards.toLocaleString();
  }
}

/**
 * Update Parcels List & Total Summary
 */
function updateParcelsListUI() {
  const parcelListContainer = document.getElementById('parcelList');
  const parcelCountBadge = document.getElementById('parcelCountBadge');

  const totalFormattedCode = document.getElementById('totalFormattedCode');
  const totalHumanText = document.getElementById('totalHumanText');
  const totalSqFtVal = document.getElementById('totalSqFtVal');
  const totalSqYardsVal = document.getElementById('totalSqYardsVal');
  const totalSqMetersVal = document.getElementById('totalSqMetersVal');

  const summaryResult = CalculatorEngine.calculateSum(state.parcelsList);
  state.lastResult = summaryResult;

  if (parcelCountBadge) {
    parcelCountBadge.textContent = `${state.parcelsList.length} ${state.parcelsList.length === 1 ? 'Parcel' : 'Parcels'}`;
  }

  if (parcelListContainer) {
    if (state.parcelsList.length === 0) {
      parcelListContainer.innerHTML = `
        <div class="empty-parcel-state">
          <span>🌱</span>
          <p>No parcels added yet. Enter a size above and tap <strong>+ Add</strong> to add land sizes.</p>
        </div>
      `;
    } else {
      let html = '';
      summaryResult.items.forEach((item, index) => {
        html += `
          <div class="parcel-item">
            <div class="parcel-item-left">
              <div class="parcel-idx">${index + 1}</div>
              <div class="parcel-info">
                <div class="parcel-code">${item.rawInput}</div>
                <div class="parcel-human">${item.decoded.humanText}</div>
              </div>
            </div>
            <button class="parcel-del-btn" data-index="${index}" title="Delete parcel">🗑️</button>
          </div>
        `;
      });
      parcelListContainer.innerHTML = html;

      // Add click listeners to delete buttons
      const delBtns = parcelListContainer.querySelectorAll('.parcel-del-btn');
      delBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          triggerHaptic();
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (!isNaN(idx)) {
            state.parcelsList.splice(idx, 1);
            updateDisplayUI();
            updateParcelsListUI();
          }
        });
      });
    }
  }

  // Update total summary card
  if (totalFormattedCode) totalFormattedCode.textContent = summaryResult.total.formattedCode;
  if (totalHumanText) totalHumanText.textContent = summaryResult.total.humanText;
  if (totalSqFtVal) totalSqFtVal.textContent = summaryResult.total.conversions.totalSqFt.toLocaleString();
  if (totalSqYardsVal) totalSqYardsVal.textContent = summaryResult.total.conversions.totalSqYards.toLocaleString();
  if (totalSqMetersVal) totalSqMetersVal.textContent = summaryResult.total.conversions.totalSqMeters.toLocaleString();
}

/**
 * Save current calculation to local storage history
 */
function saveCurrentCalculation() {
  if (state.parcelsList.length === 0 && (state.inputBuffer === '0' || !state.inputBuffer)) {
    alert('Please enter or add land sizes before saving.');
    return;
  }

  // Ensure current input is added if not empty
  if (state.inputBuffer !== '0' && state.inputBuffer !== '') {
    addCurrentInputAsParcel();
  }

  const summaryResult = CalculatorEngine.calculateSum(state.parcelsList);

  const record = {
    parcels: [...state.parcelsList],
    formattedTotal: summaryResult.total.formattedCode,
    humanTotal: summaryResult.total.humanText,
    sqFtTotal: summaryResult.total.conversions.totalSqFt
  };

  const saved = StorageManager.saveRecord(record);
  if (saved) {
    alert(`Saved Calculation (${record.humanTotal}) to History!`);
  }
}

/**
 * Physical Keyboard Support
 */
function initKeyboardSupport() {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key;

    if (key >= '0' && key <= '9') {
      handleKeyInput(key);
    } else if (key === '.' || key === ',') {
      handleKeyInput('.');
    } else if (key === '+') {
      handleKeyInput('ADD_PARCEL');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleKeyInput('=');
    } else if (key === 'Backspace') {
      handleKeyInput('DEL');
    } else if (key === 'Escape') {
      handleKeyInput('AC');
    }
  });
}

/**
 * Trigger Touch Haptic Feedback Vibration (Android / Supported Browsers)
 */
function triggerHaptic() {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignore if unsupported
    }
  }
}
