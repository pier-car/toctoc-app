/**
 * src/pages/Profile.jsx
 *
 * Anonymous user profile page for TocToc web.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, signInAnonymouslyAndGetUser } from '../services/firebase';

export default function ProfilePage() {
  const [userId, setUserId] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });

    if (!auth.currentUser) {
      signInAnonymouslyAndGetUser().catch((err) => {
        console.error('[ProfilePage] sign-in error:', err);
      });
    }

    return () => unsubscribe();
  }, []);

  const handleResetIdentity = async () => {
    const confirmed = window.confirm(
      'This will create a completely new anonymous profile. Your current identity will be lost. Continue?',
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      await signOut(auth);
      const user = await signInAnonymouslyAndGetUser();
      setUserId(user.uid);
      setToast('Identity reset! 🆕');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Could not reset identity. Please try again.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setResetting(false);
    }
  };

  const handle = userId ? `@${userId.slice(0, 8)}` : '…';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      {/* Brand icon */}
      <span className="text-6xl mb-1">🔔</span>
      <h1 className="text-3xl font-extrabold text-brand tracking-tight mb-8">TocToc</h1>

      {/* User handle */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[1.2px] mb-1">
          Your Handle
        </p>
        <p className="text-[26px] font-extrabold text-gray-900 tracking-tight">{handle}</p>
      </div>

      {/* Tagline */}
      <p className="text-[15px] text-gray-500 leading-relaxed mb-6 max-w-xs">
        You're anonymous. Your neighbors know you by your actions, not your name.
      </p>

      {/* Privacy pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['No sign-up', 'No phone', 'No data sold'].map((text) => (
          <span
            key={text}
            className="bg-violet-100 text-brand text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            {text}
          </span>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={handleResetIdentity}
        disabled={resetting}
        aria-label="Reset Identity"
        className={`border-2 border-brand text-brand rounded-2xl px-7 py-3.5 text-[15px] font-bold min-w-[180px] transition-all mb-3 ${
          resetting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-50 active:scale-[0.98]'
        }`}
      >
        {resetting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            Resetting…
          </span>
        ) : (
          '🔄  Reset Identity'
        )}
      </button>

      <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
        Resetting creates a brand-new anonymous profile. This action cannot be undone.
      </p>

      {/* Flyer link */}
      <button
        onClick={() => navigate('/flyer')}
        className="mt-8 text-sm text-brand font-semibold hover:underline"
      >
        📋 Generate Building Flyer
      </button>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
