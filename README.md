# Chrome AI Demo

This repository demonstrates the capabilities of the [Web AI APIs](https://developer.chrome.com/docs/ai/built-in-apis) (formerly Chrome AI APIs). It showcases how to build applications that leverage on-device AI models directly in the browser, offering benefits like:

- **Privacy**: Data stays on the device.
- **Latency**: No network round-trips for inference.
- **Offline Capability**: Works without an internet connection.

### ✨ Features

- **Summarizer**: Generate summaries of text.
- **Language Detector**: Detect the language of a given text.
- **Writer/Rewriter**: (Coming soon) Assist with writing tasks.

## 🌐 Browser Support

These APIs are currently experimentally available in Chrome.

- **Status**: Early Preview / Canary.
- **Requirements**: You may need to enable specific flags (e.g., `#optimization-guide-on-device-model`, `#prompt-api-for-gemini-nano`) and download on-device models.
- **Documentation**: Check the [Official Web AI APIs Documentation](https://developer.chrome.com/docs/ai/built-in-apis) for the latest setup instructions.

## 🧹 Managing AI Models

To save space or reset your environment, you may need to delete the downloaded models.

**Location**:
The models are typically stored in the `OptGuideOnDeviceModel` directory.

- **Windows**: `C:\Users\<User>\AppData\Local\Google\Chrome\User Data\OptGuideOnDeviceModel`
- **macOS**: `~/Library/Application Support/Google/Chrome/OptGuideOnDeviceModel`

**To delete**:

1. Close Chrome.
2. Navigate to the directory above.
3. Delete the specific version folder or the entire `OptGuideOnDeviceModel` directory.
4. Restart Chrome (the model will be re-downloaded when requested next time).
