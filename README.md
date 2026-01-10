# Chrome Built-in AI Demo

This repository demonstrates the capabilities of Google's **Built-in AI**, a set of APIs that enable web applications to run on-device AI models directly in the user's browser.

These APIs allow for powerful inference (powered by models like Gemini Nano) without server-side processing, offering:

- 🔒 **Privacy**: Sensitive data never leaves the user's device.
- ⚡ **Zero Latency**: No network round-trips; inference happens locally.
- 📶 **Offline Capability**: Full functionality without an internet connection.
- 💰 **Zero Cost**: No tokens or cloud API billing.

## 🧩 Features

This demo implements the "Task-Specific" APIs, which are optimized for common web patterns:

- **[Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)**: Instantly condenses long-form content (articles, reviews, chat logs) into key points or headlines.
- **[Language Detector API](https://developer.chrome.com/docs/ai/language-detection)**: High-speed, on-device language identification to route content for translation.
- **[Translator API](https://developer.chrome.com/docs/ai/translator-api)**: Real-time client-side translation, allowing users to consume content in their preferred language without cloud dependencies.

> **Note**: This demo focuses on APIs currently targeting Stable or Origin Trial availability. Experimental APIs like **Writer** and **Rewriter** will be added as they mature.

## 🤝 Standards & Compatibility

These APIs are currently **experimental proposals** developed by Chrome.

- They are being incubated in the **W3C Web Incubator Community Group (WICG)**.
- The goal is to standardize these as part of the "Web AI" specification (e.g., `window.ai`), ensuring eventual compatibility across Firefox, Safari, and Edge.
- Currently, they operate primarily in Chromium-based browsers.

## 🌐 Browser Support & Setup

These APIs are available starting in **Chrome 138**.

**Prerequisites:**

1.  **Browser**: Chrome 138+ (or Chrome Canary for the absolute latest features).
2.  **AI Components**: When you first use an API, Chrome may need to download the model binaries.
    - _Tip:_ You can force the download by visiting `chrome://components` and clicking "Check for update" on the **Optimization Guide On Device Model**.

**Enabling Flags (If using versions older than Stable 138):**
If the APIs are not active by default, enable these flags in `chrome://flags`:

- `Optimization Guide On Device Model` -> **Enabled BypassPrefRequirement**
- `Prompt API for Gemini Nano` -> **Enabled**

For the latest status, check the [Chrome Built-in AI Docs](https://developer.chrome.com/docs/ai/built-in-apis).

## 🧹 Managing AI Models

These models are stored locally on your machine. To free up disk space or force a re-download for debugging:

**Model Storage Paths:**

- **Windows**: `C:\Users\<User>\AppData\Local\Google\Chrome\User Data\OptGuideOnDeviceModel`
- **macOS**: `~/Library/Application Support/Google/Chrome/OptGuideOnDeviceModel`
- **Linux**: `~/.config/google-chrome/OptGuideOnDeviceModel`

**To delete:**

1. Close Chrome completely.
2. Delete the `OptGuideOnDeviceModel` directory.
3. Restart Chrome (the model will re-download upon the next API request).
