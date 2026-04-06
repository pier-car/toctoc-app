/**
 * src/pages/NewPost.jsx
 *
 * Post creation form for TocToc web.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { createPost, auth } from '../services/firebase';
import useLocation from '../hooks/useLocation';
import CategoryPill from '../components/CategoryPill';

const CATEGORIES = [
  { id: 'package', emoji: '📦', label: 'Package', color: '#4A90E2' },
  { id: 'borrow', emoji: '🛠️', label: 'Borrow', color: '#F5A623' },
  { id: 'groupbuy', emoji: '🍕', label: 'Group Buy', color: '#E74C3C' },
  { id: 'info', emoji: 'ℹ️', label: 'Building Info', color: '#95A5A6' },
];

const MAX_CHARS = 280;

export default function NewPostPage() {
  const { location } = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedCategory) {
      showToast('Please select a category for your post.');
      return;
    }
    if (!message.trim()) {
      showToast('Please write something before posting.');
      return;
    }
    if (!location) {
      showToast('We need your location to post. Please allow location access and try again.');
      return;
    }

    setSubmitting(true);
    try {
      const user = auth.currentUser;
      await createPost({
        category: selectedCategory,
        message: message.trim(),
        authorName: authorName.trim() || 'A Neighbor',
        authorId: user?.uid ?? 'anonymous',
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      setSelectedCategory(null);
      setMessage('');
      setAuthorName('');
      showToast('Your message is live for the next 24 hours! 🎉', 'success');
      setTimeout(() => navigate('/feed'), 1500);
    } catch {
      showToast('Could not submit your post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedCategory, message, authorName, location, navigate]);

  const charsLeft = MAX_CHARS - message.length;
  const isOverLimit = charsLeft < 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">New Post</h1>
        <p className="text-sm text-gray-500 mt-1">Your neighbors will see this for 24 hours.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-8 space-y-5">
        {/* Category selector */}
        <div>
          <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Category
          </label>
          <div className="flex flex-wrap">
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.id}
                emoji={cat.emoji}
                label={cat.label}
                color={cat.color}
                isSelected={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Message input */}
        <div>
          <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Message
          </label>
          <div
            className={`bg-white rounded-2xl border-[1.5px] p-3.5 ${
              isOverLimit ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <textarea
              className={`w-full text-[15px] leading-relaxed resize-none outline-none min-h-[100px] ${
                isOverLimit ? 'text-red-500' : 'text-gray-900'
              }`}
              placeholder="What do you need? Be concise and friendly 🙂"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-label="Post message input"
              rows={4}
            />
            <span
              className={`block text-right text-xs mt-1.5 ${
                isOverLimit ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {charsLeft}
            </span>
          </div>
        </div>

        {/* Display name */}
        <div>
          <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Your name{' '}
            <span className="font-normal normal-case tracking-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            className="w-full bg-white rounded-2xl border-[1.5px] border-gray-200 px-3.5 py-3 text-[15px] text-gray-900 outline-none focus:border-brand transition-colors"
            placeholder="A Neighbor"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={32}
            aria-label="Display name input"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || isOverLimit}
          aria-label="Submit post"
          className={`w-full bg-brand text-white rounded-2xl py-4 text-base font-bold transition-all ${
            submitting || isOverLimit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5A52E0] active:scale-[0.99]'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Posting…
            </span>
          ) : (
            'Post to Building 🔔'
          )}
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg z-50 transition-all ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
