# Land Calculator PWA - Technical Knowledge Base

Welcome to the **Land Calculator PWA** codebase. This document serves as an architectural guide and reference for developers and future AI agents working on this repository.

---

## 📐 Project Overview & Goals
The **Land Calculator PWA** is a high-performance, mobile-first, offline-capable Progressive Web Application built to perform land dimension measurements, plot area summations, unit conversions, and property valuation estimations.

### Key Objectives:
1. **100% Offline Reliability**: Operates seamlessly in zero-connectivity / Airplane mode via a Service Worker.
2. **Native Android Feel**: Installs directly to the Android Home Screen with standalone display, no Chrome URL bar, fast touch feedback, and optional haptic vibration.
3. **No External Build Dependencies**: Built using standard modern web technologies (HTML5, Vanilla CSS3, ES6 JavaScript) to guarantee rapid development, zero build tool overhead, and maximum longevity.

---

## 🏗️ Architecture & Technology Stack

```
land-calculator/
├── index.html           # Main PWA entry point & semantic layout
├── manifest.json        # Web App Manifest for mobile installation
├── sw.js                # Service Worker for offline asset caching
├── PROJECT_TASKS.md     # Active roadmap and task status tracker
├── KNOWLEDGE_BASE.md    # Developer & AI Agent architectural reference
├── css/
│   └── styles.css       # Mobile-first design system & CSS variables
└── js/
    ├── app.js           # PWA lifecycle, tabs, install prompts, UI events
    ├── storage.js       # LocalStorage wrapper for offline history & presets
    └── calculator.js    # Core land calculation logic (feet/inches, geometry, units)
```

### Technology Breakdown:
* **HTML5**: Semantic tags, accessible forms, mobile viewports (`viewport-fit=cover`).
* **Vanilla CSS3**: Design system tokens (HSL colors, dark mode defaults), CSS Grid & Flexbox, smooth transitions, hardware-accelerated transforms (`translate3d`), glassmorphic cards.
* **JavaScript (ES6 Modules)**: Native modular structure without bundlers.
* **Service Worker API**: Caches `index.html`, `styles.css`, JS files, and assets for offline use using a Cache-First network strategy.
* **Web Storage API (`localStorage`)**: Persists user calculations, plot lists, custom presets, and theme preferences locally on device.

---

## 📱 PWA & Offline Mechanics

### How Offline Works:
1. When `index.html` is loaded for the first time, `js/app.js` registers `sw.js`.
2. `sw.js` executes the `install` event and caches all essential static assets into `land-calculator-v1`.
3. Subsequent page loads use the `fetch` event handler in `sw.js` to serve cached resources immediately.
4. An offline banner automatically alerts the user if network status changes, though all app functions remain operational offline.

---

## ⚙️ Coding & Design Conventions

1. **CSS Variables**: All colors, fonts, spacings, and border radii are defined in `:root` in `css/styles.css`.
2. **Mobile First UI**: Touch targets must be at least $44 \times 44$ px for comfortable tapping on mobile devices.
3. **Formatting & Math**:
   - Always preserve high precision during math calculations before rounding for UI display.
   - Separate calculation logic (`js/calculator.js`) from UI DOM manipulation (`js/app.js`).
4. **Agent Guidelines**:
   - Keep `PROJECT_TASKS.md` updated as features are added or updated.
   - Ensure all new assets/scripts are registered in `sw.js` cache manifest.
