# TocToc Web

Standalone React web app for TocToc — the hyper-local, anonymous, ephemeral community bulletin board.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Backend | Firebase Firestore + Anonymous Auth |
| Icons | lucide-react |
| QR Codes | qrcode.react |

## Getting Started

### 1. Install dependencies

```bash
cd web
npm install
```

### 2. Configure Firebase

Open `src/services/firebase.js` and replace every `YOUR_*` placeholder with the values from your Firebase project console (**Project settings → Your apps → SDK setup**).

### 3. Run in development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

The output is placed in `dist/` and can be deployed to any static host (Netlify, Vercel, Firebase Hosting, etc.).

## Features

- 🏠 **Feed** – Real-time nearby posts filtered to a 100 m radius
- ➕ **New Post** – Create ephemeral posts with category, message, and optional name
- 💬 **Chat** – Anonymous 1-to-1 conversations with neighbors
- 👤 **Profile** – View anonymous handle, reset identity
- 📋 **Flyer** – Generate a QR-code flyer to invite building neighbors

## Firestore Setup

Follow the same Firestore rules and collections described in the root [`README.md`](../README.md).
