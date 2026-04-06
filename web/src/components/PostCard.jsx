/**
 * src/components/PostCard.jsx
 *
 * Animated card component that renders a single TocToc post.
 *
 * Visual features:
 *  - White card with 16px rounded corners and subtle shadow
 *  - 4px left accent bar coloured by category
 *  - Category emoji + label pill
 *  - Message body with "Read more" expand
 *  - Footer: author · relative time · time remaining · reply icon
 *  - CSS fade+slide entrance animation
 */
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { formatRelativeTime, getTimeRemaining } from '../utils/timeUtils';

const CATEGORY_META = {
  package: { color: '#4A90E2', emoji: '📦', label: 'Package' },
  borrow: { color: '#F5A623', emoji: '🛠️', label: 'Borrow' },
  groupbuy: { color: '#E74C3C', emoji: '🍕', label: 'Group Buy' },
  info: { color: '#95A5A6', emoji: 'ℹ️', label: 'Building Info' },
};

export default function PostCard({ post, onPress }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[post.category] ?? CATEGORY_META.info;
  const isLong = post.message.length > 120;

  return (
    <div className="mx-4 my-1.5 animate-[fadeSlide_0.35s_ease_both]">
      <button
        onClick={onPress}
        aria-label={`Post: ${post.message}`}
        className="w-full flex flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.99] transition-all text-left"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* Accent bar */}
        <div className="w-1 flex-shrink-0" style={{ backgroundColor: meta.color }} />

        {/* Content */}
        <div className="flex-1 p-3.5">
          {/* Category pill */}
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-[10px] mb-2 text-[11px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: meta.color + '18', color: meta.color }}
          >
            <span className="text-xs">{meta.emoji}</span>
            {meta.label}
          </span>

          {/* Message */}
          <p
            className="text-[15px] text-gray-900 leading-relaxed mb-2.5"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {post.message}
          </p>

          {!expanded && isLong && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              className="text-[13px] text-brand font-semibold mb-2 block"
            >
              Read more
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center gap-1 text-[12px] text-gray-400">
            <span className="truncate max-w-[90px]">{post.authorName || 'A Neighbor'}</span>
            <span className="text-gray-300 mx-0.5">·</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
            <span className="text-gray-300 mx-0.5">·</span>
            <span className="text-amber-500">{getTimeRemaining(post.expiresAt)}</span>
            <div className="flex-1" />
            <MessageCircle size={20} color="#6C63FF" strokeWidth={1.8} />
          </div>
        </div>
      </button>
    </div>
  );
}
