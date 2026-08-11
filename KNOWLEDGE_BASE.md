# Land Calculator PWA - Technical Knowledge Base

Welcome to the **Land Calculator PWA** codebase. This document serves as an architectural guide and reference for developers and future AI agents working on this repository.

---

## 📐 Project Overview & Goals
The **Land Calculator PWA** is a high-performance, mobile-first, offline-capable Progressive Web Application built to perform land dimension measurements, plot area summations, unit conversions, and property valuation estimations.

### Key Objectives:
1. **100% Offline Reliability**: Operates seamlessly in zero-connectivity / Airplane mode via a Service Worker (`sw.js`).
2. **Native Android Feel**: Installs directly to the Android Home Screen with standalone display, no Chrome URL bar, fast touch feedback, and optional haptic vibration.
3. **No External Build Dependencies**: Built using standard modern web technologies (HTML5, Vanilla CSS3, ES6 JavaScript) to guarantee rapid development, zero build tool overhead, and maximum longevity.

---

## 🏗️ Architecture & Technology Stack

```
land-calculator/
├── index.html                 # Main PWA entry point & semantic layout
├── manifest.json              # Web App Manifest for mobile installation
├── sw.js                      # Service Worker for offline asset caching (v5)
├── README.md                  # Comprehensive user & developer documentation
├── PROJECT_TASKS.md           # Active roadmap and task status tracker
├── KNOWLEDGE_BASE.md          # Developer & AI Agent architectural reference
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions automated testing & deployment
├── css/
│   └── styles.css             # Mobile-first design system & CSS variables (Light/Dark)
├── js/
│   ├── app.js                 # PWA lifecycle, keypad handlers, install prompts, UI events
│   ├── storage.js             # LocalStorage wrapper for offline history & presets
│   └── calculator.js          # Core land calculation logic (A.GGCC format, unit conversion)
└── tests/
    ├── calculator.test.js     # Math unit tests (12 cases)
    ├── theme.test.js          # Theme & settings persistence tests (3 cases)
    ├── ui.test.js             # Keypad & list UI interaction tests (8 cases)
    ├── user_flow.test.js      # Keypad user action sequence simulation
    └── pwa.test.js            # PWA manifest, service worker & HTML tag compliance (20 cases)
```

### Technology Breakdown:
* **HTML5**: Semantic tags, accessible forms, mobile viewports (`viewport-fit=cover`, safe-area-inset-top/bottom).
* **Vanilla CSS3**: Design system tokens (HSL colors, dark mode defaults, light theme toggle), CSS Grid & Flexbox, smooth transitions, hardware-accelerated transforms (`translate3d`), glassmorphic cards, iOS & Android notch/status bar safe area handling (`env(safe-area-inset-top)`).
* **JavaScript (ES6 Modules)**: Native modular structure without bundlers.
* **Service Worker API**: Caches static assets into `land-calculator-v6` for instant offline loading with cache fallback.
* **Web Storage API (`localStorage`)**: Persists user calculations, parcel breakdown lists, and theme preferences locally on device.

---

## 📱 PWA & Offline Mechanics

### How Offline Works:
1. When `index.html` is loaded for the first time, `js/app.js` registers `sw.js`.
2. `sw.js` executes the `install` event and caches all essential static assets into `land-calculator-v6`.
3. Subsequent page loads use the network-first with cache-fallback strategy in `sw.js` to serve cached resources immediately offline.
4. An offline banner automatically alerts the user if network status changes to offline, though all app functions remain operational offline.
5. Safe Area Inset Support: Uses `viewport-fit=cover` in `index.html` combined with `calc(0.85rem + env(safe-area-inset-top, 0px))` in `css/styles.css` to prevent status bar/notch overlap when saved to Home Screen on iOS and Android standalone PWAs.

---

## 🚀 CI/CD & Automated Testing

### Test Suite Execution
Run tests directly with Node.js:
- `node tests/calculator.test.js`
- `node tests/theme.test.js`
- `node tests/ui.test.js`
- `node tests/user_flow.test.js`
- `node tests/pwa.test.js`

### Deployment Pipeline
Defined in `.github/workflows/deploy.yml`:
- Triggered on every push to `master`.
- Runs all 5 automated test scripts in Ubuntu runner.
- Deploys static bundle to GitHub Pages via official GitHub Actions (`actions/deploy-pages@v4`).

---

## ⚙️ Coding & Design Conventions

1. **CSS Variables**: All colors, fonts, spacings, and border radii are defined in `:root` and `[data-theme="light"]` in `css/styles.css`.
2. **Mobile First UI**: Touch targets are at least $44 \times 44$ px for comfortable tapping on mobile devices.
3. **Formatting & Math**:
   - Preserve high precision during math calculations before rounding for UI display.
   - Separate calculation logic (`js/calculator.js`) from UI DOM manipulation (`js/app.js`).
4. **Agent Guidelines**:
   - Keep `PROJECT_TASKS.md` updated as features are added or updated.
   - Ensure all new assets/scripts are registered in `sw.js` cache manifest.
