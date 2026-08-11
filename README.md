# 📐 Land Calculator PWA

[![Deploy to GitHub Pages](https://github.com/rahul-konduru/land-calculator/actions/workflows/deploy.yml/badge.svg)](https://github.com/rahul-konduru/land-calculator/actions/workflows/deploy.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A high-performance, mobile-first, 100% offline-capable Progressive Web Application (PWA) designed for precise land parcel dimension measurement, area summation, and unit conversion (Acres, Guntas, Cents, Square Feet, Square Yards, Square Meters).

---

## 🌟 Key Features

* 📱 **Native Phone Calculator UI**: Phone-style digital keypad designed with large touch targets, haptic feedback support, clear display, and land parcel management.
* ⚡ **100% Offline Reliability**: Powered by a custom Service Worker (`sw.js`). Operates seamlessly in zero-connectivity / Airplane mode.
* 🌾 **Land Input Format Decoding (`A.GGCC`)**: Automatically parses inputs like `1.21` (1 Acre, 21 Guntas) and `1.2050` (1 Acre, 20 Guntas, 50 Cents).
* 📐 **Instant Unit Conversions**: Live display of combined land area converted across **Square Feet**, **Square Yards**, and **Square Meters**.
* 🎨 **Dual Design System (Light & Dark Theme)**: Native OLED dark mode default with an animated light theme toggle switch.
* 💾 **Local Storage History**: Automatically saves calculations, parcel breakdown lists, and user settings locally without requiring an account or cloud API.
* 🛠️ **Zero Build Dependencies**: Pure HTML5, Vanilla CSS3, and ES6 JavaScript. Fast load times, zero node modules required for runtime.

---

## 📐 Land Measurement Formulas & Notation

In traditional land measurement systems across South Asia (e.g., Telangana, Andhra Pradesh, Karnataka):

$$1 \text{ Acre} = 40 \text{ Guntas} = 4,000 \text{ Cents}$$
$$1 \text{ Gunta} = 100 \text{ Cents} = 1,089 \text{ Sq Ft} = 121 \text{ Sq Yds} = 101.17 \text{ Sq Mtr}$$
$$1 \text{ Cent} = 10.89 \text{ Sq Ft} = 1.21 \text{ Sq Yds} = 1.0117 \text{ Sq Mtr}$$
$$1 \text{ Acre} = 43,560 \text{ Sq Ft} = 4,840 \text{ Sq Yds} = 4,046.86 \text{ Sq Mtr}$$

### Input Format (`A.GGCC`)
- `1.21` $\rightarrow$ **1 Acre, 21 Guntas** ($1 \text{ Ac} + 21 \text{ Gn}$)
- `1.02` $\rightarrow$ **1 Acre, 2 Guntas** ($1 \text{ Ac} + 2 \text{ Gn}$)
- `1.2` $\rightarrow$ **1 Acre, 20 Guntas** (automatically padded to 2 digits)
- `1.2050` $\rightarrow$ **1 Acre, 20 Guntas, 50 Cents**
- `0.39` $\rightarrow$ **0 Acres, 39 Guntas**
- `0.39` + `0.01` = **1.00** (**1 Acre** after 40 Guntas rollover)

---

## 📲 PWA Installation Guide

### Android (Google Chrome)
1. Open the website in Chrome.
2. Tap the **📲 Install App** button in the header (or tap Chrome Menu $\rightarrow$ *Add to Home Screen*).
3. Confirm installation. The app will appear on your Home Screen and App Drawer like a native app.

### iOS (Apple Safari)
1. Open the website in Safari.
2. Tap the **Share** button ($\uparrow$).
3. Scroll down and tap **Add to Home Screen**.

---

## 🚀 Live Hosting & Deployment

The application is completely static and can be deployed for free on any static host with HTTPS:

### 1. GitHub Pages (Automated via GitHub Actions)
Every push to the `master` branch triggers `.github/workflows/deploy.yml` which runs the automated test suites and deploys the latest version to GitHub Pages.
- Repository: `https://github.com/rahul-konduru/land-calculator`

### 2. Cloudflare Pages
- Connect repository $\rightarrow$ Build output directory: `./` $\rightarrow$ Deploy.

### 3. Netlify / Vercel
- Drag and drop project directory or link GitHub repository without build command.

---

## 🧪 Automated Testing

The project includes lightweight native ES module test suites using Node.js without requiring third-party test runners:

```bash
# Run land calculator core math unit tests (12 tests)
node tests/calculator.test.js

# Run theme & storage persistence tests (3 tests)
node tests/theme.test.js

# Run UI integration tests (8 tests)
node tests/ui.test.js

# Run full user keypad flow simulation
node tests/user_flow.test.js

# Run PWA & offline compliance checks (20 tests)
node tests/pwa.test.js
```

---

## 📂 Codebase Structure

```
land-calculator/
├── index.html                 # PWA main UI layout & accessibility tags
├── manifest.json              # Web App Manifest for mobile installation
├── sw.js                      # Service Worker for 100% offline caching
├── README.md                  # Project overview & documentation
├── PROJECT_TASKS.md           # Development roadmap & status tracker
├── KNOWLEDGE_BASE.md          # Architectural guide & knowledge base
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions deployment workflow
├── css/
│   └── styles.css             # CSS design system (HSL tokens, light/dark themes)
├── js/
│   ├── app.js                 # UI event listeners, keypad handler, PWA lifecycle
│   ├── calculator.js          # Core land math calculation & parsing engine
│   └── storage.js             # LocalStorage manager for history & preferences
└── tests/
    ├── calculator.test.js     # Math unit tests
    ├── theme.test.js          # Theme storage tests
    ├── ui.test.js             # UI interaction tests
    ├── user_flow.test.js      # Keypad user flow tests
    └── pwa.test.js            # PWA compliance tests
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
