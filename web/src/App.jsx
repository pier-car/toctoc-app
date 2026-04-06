/**
 * App.jsx
 *
 * Root entry point for the TocToc standalone web app.
 * Signs in anonymously with Firebase on startup then renders routes.
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { signInAnonymouslyAndGetUser } from './services/firebase';
import NavBar from './components/NavBar';
import FeedPage from './pages/Feed';
import NewPostPage from './pages/NewPost';
import ChatPage from './pages/Chat';
import ProfilePage from './pages/Profile';
import FlyerPage from './pages/Flyer';

export default function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    signInAnonymouslyAndGetUser()
      .catch((err) => {
        console.error('[App] Firebase anonymous sign-in failed:', err);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading TocToc…</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-gray-50 relative">
        {/* Page content - padded so it doesn't hide behind bottom nav */}
        <div className="flex-1 overflow-y-auto pb-16">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/post" element={<NewPostPage />} />
            <Route path="/chats" element={<ChatsPlaceholder />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/flyer" element={<FlyerPage />} />
          </Routes>
        </div>

        {/* Bottom navigation */}
        <NavBar />
      </div>
    </BrowserRouter>
  );
}

function ChatsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <span className="text-6xl mb-4">💬</span>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Chats coming soon</h2>
      <p className="text-sm text-gray-500 leading-relaxed">
        Tap a post in the Feed to start an anonymous chat with your neighbor.
      </p>
    </div>
  );
}
