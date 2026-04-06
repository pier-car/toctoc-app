/**
 * src/pages/Feed.jsx
 *
 * The main feed page for TocToc web.
 * Requests the user's location, subscribes to nearby posts, shows PostCards.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import useLocation from '../hooks/useLocation';
import usePosts from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import EmptyFeed from '../components/EmptyFeed';

export default function FeedPage() {
  const { location, error: locationError, loading: locationLoading } = useLocation();
  const { posts, loading: postsLoading, error: postsError } = usePosts(location);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const isLoading = locationLoading || postsLoading;
  const error = locationError || postsError;

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handlePostPress = useCallback(
    (post) => {
      navigate(`/chat/${post.id}`, { state: { post } });
    },
    [navigate],
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">TocToc 🔔</h1>
            <p className="text-xs font-semibold text-brand mt-0.5">Building Bubble • 100m</p>
          </div>
          <button
            onClick={handleRefresh}
            aria-label="Refresh feed"
            className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20">
          <div className="w-9 h-9 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Finding your building…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center">
          <span className="text-5xl mb-3">📍</span>
          <p className="text-sm text-red-500 leading-relaxed">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div key={refreshKey} className="py-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPress={() => handlePostPress(post)} />
          ))}
        </div>
      )}
    </div>
  );
}
