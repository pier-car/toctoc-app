/**
 * src/components/EmptyFeed.jsx
 *
 * Rendered by the Feed page when no nearby, non-expired posts are available.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmptyFeed({ onCreatePost }) {
  const navigate = useNavigate();

  const handleCreate = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      navigate('/post');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 pt-16 text-center">
      <span className="text-6xl mb-4">🤫</span>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">It's quiet around here</h2>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-7">
        Be the first to post something for your building!
      </p>
      <button
        onClick={handleCreate}
        className="bg-brand text-white px-7 py-3.5 rounded-2xl text-[15px] font-bold hover:bg-[#5A52E0] active:scale-95 transition-all"
      >
        Create a Post
      </button>
    </div>
  );
}
