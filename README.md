<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TfBUgElY0Y1dAuCUFgfwubAxGO_ejEww

## Run Locally

**Prerequisites:**  Node.js

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm run dev
   ```

3. **Configure API Key:**
   - Open the app in your browser.
   - Click the **Settings** (gear icon) in the top right.
   - Enter your **Gemini API Key** in the "AI Configuration" section.
   - *Note: If you don't have a key, the app still works with offline fallback templates!*

## How to Deploy (Fast & Free)

The easiest way to host this project is using **Vercel** or **Netlify**.

### Option 1: Vercel (Recommended)
1. Push this project to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and sign up/login.
3. Click **"Add New Project"** and select your GitHub repo.
4. Keep the default settings (Framework: Vite).
5. Click **Deploy**.
6. Done! Your app is live.

### Option 2: Netlify
1. Push this project to GitHub.
2. Go to [Netlify.com](https://netlify.com).
3. Click **"New site from Git"**.
4. Choose your repo.
5. Click **"Deploy site"**.

Since the API Key is stored in your browser's LocalStorage, you don't need to configure environment variables on the server. Every user brings their own key!
