/**
 * src/components/CategoryPill.jsx
 *
 * A pill/chip button used to select a post category.
 */
import React from 'react';

export default function CategoryPill({ emoji, label, isSelected, onPress, color }) {
  return (
    <button
      onClick={onPress}
      aria-label={`Category: ${label}`}
      aria-pressed={isSelected}
      style={
        isSelected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: '#fff', borderColor: '#D1D5DB' }
      }
      className="flex items-center gap-1 px-3 py-2 rounded-full border-[1.5px] mr-2 mb-2 transition-all active:scale-95"
    >
      <span className="text-sm">{emoji}</span>
      <span
        className="text-[13px] font-semibold"
        style={{ color: isSelected ? '#fff' : '#374151' }}
      >
        {label}
      </span>
    </button>
  );
}
