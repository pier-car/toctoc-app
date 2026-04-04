# TocToc — Your Digital Doorbell 🔔

> *"Hyper-local collaboration for the people you live next to."*

---

## Vision — Digital Neighbor Collaboration: Moving from Social Networks to Utility Networks

Modern social networks are designed for reach. TocToc is designed for **proximity**.

The idea is simple: the most under-utilised social network you belong to is the one right outside your door — your building, your block, your immediate neighborhood. Yet most neighbor communication happens through bloated WhatsApp groups, paper notices in hallways, or not at all.

**TocToc is a utility-first, privacy-first, ephemeral bulletin board** that works on four principles:

| Principle | What it means |
|---|---|
| **Hyper-local** | Posts are only visible to users within a 100-metre radius. Your building, no further. |
| **Ephemeral** | Every post expires in 24 hours, keeping the board clean and relevant. |
| **Utility-first** | No social graph, no likes, no follows. Only actionable requests and information. |
| **Privacy-first** | Fully anonymous. No sign-up, no phone number, no name required. |

---

## Features

- 📍 **Geofencing** — Posts are filtered client-side using the Haversine formula to a strict 100 m radius
- 📦🛠️🍕ℹ️ **Post Categories** — Package, Borrow, Group Buy, Building Info
- ⏳ **24-hour expiry** — Posts self-destruct after a day; no stale content
- 💬 **Anonymous Chat** — 1-to-1 private conversation attached to any post, no accounts needed
- 🔒 **No sign-up** — Firebase Anonymous Auth creates a throwaway identity on first launch
- ✨ **Premium UI** — iOS-inspired minimalist design with animated cards and a purple brand palette

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pier-car/toctoc-app.git
cd toctoc-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase (see below)

### 4. Start the development server

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your device, or press `i` / `a` to open in a simulator.

---

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Anonymous Authentication** under *Authentication → Sign-in method*.
3. Create a **Firestore Database** in production mode.
4. Register a **Web app** in your project (the React Native SDK uses the web SDK).
5. Copy your config values into `src/services/firebase.js`, replacing the `YOUR_*` placeholders:

```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### Firestore Security Rules

Paste these rules into *Firestore → Rules* in the Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Posts: anyone can read; only authenticated users can write
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll(['category','message','authorId','coordinates','expiresAt'])
                    && request.resource.data.message.size() <= 280;
      allow update, delete: if request.auth != null
                             && request.auth.uid == resource.data.authorId;
    }

    // Chats: only the two participants can read/write
    match /chats/{chatId} {
      allow read, write: if request.auth != null
                         && (request.auth.uid == resource.data.responderId
                             || request.auth.uid == get(/databases/$(database)/documents/posts/$(resource.data.postId)).data.authorId);

      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null
                      && request.resource.data.senderId == request.auth.uid
                      && request.resource.data.text.size() <= 1000;
      }
    }
  }
}
```

---

## Project Structure

```
toctoc-app/
├── App.js                        # Root entry — NavigationContainer + providers
├── app.json                      # Expo managed workflow config
├── package.json                  # Dependencies
├── babel.config.js               # Babel + NativeWind plugin
├── tailwind.config.js            # Tailwind content paths
├── assets/                       # App icons & splash (add your own)
└── src/
    ├── services/
    │   └── firebase.js           # Firebase init + CRUD helpers
    ├── hooks/
    │   ├── useLocation.js        # Expo Location hook
    │   └── usePosts.js           # Real-time geo-filtered Firestore feed
    ├── screens/
    │   ├── HomeScreen.js         # Feed with pull-to-refresh
    │   ├── NewPostScreen.js      # Post creation form
    │   ├── ChatScreen.js         # Anonymous 1-to-1 chat
    │   └── ProfileScreen.js      # Anonymous identity management
    ├── components/
    │   ├── PostCard.js           # Animated, colour-accented post card
    │   ├── CategoryPill.js       # Selectable category chip
    │   └── EmptyFeed.js          # Empty-state illustration + CTA
    ├── navigation/
    │   └── AppNavigator.js       # Stack + Bottom Tab navigator
    └── utils/
        ├── geoUtils.js           # Haversine distance + radius check
        └── timeUtils.js          # Relative time & expiry formatting
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (Managed Workflow, SDK 50) |
| Navigation | React Navigation 6 (Stack + Bottom Tabs) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Backend | Firebase Firestore (real-time posts & chats) |
| Auth | Firebase Anonymous Authentication |
| Location | expo-location |
| Icons | lucide-react-native |
| Animations | React Native Animated API |

---

## License

MIT © TocToc Contributors
