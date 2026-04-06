/**
 * src/components/NavBar.jsx
 *
 * Bottom navigation bar for the TocToc web app.
 * Fixed to the bottom of the viewport.
 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Plus, MessageCircle, User } from 'lucide-react';

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] flex items-center justify-around h-16 z-50">
      <NavItem to="/feed" label="Feed" icon={Home} />

      {/* Raised FAB-style centre button */}
      <button
        onClick={() => navigate('/post')}
        aria-label="Create new post"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white shadow-[0_4px_16px_rgba(108,99,255,0.4)] -mt-6 hover:bg-[#5A52E0] active:scale-95 transition-all"
      >
        <Plus size={28} strokeWidth={2} />
      </button>

      <NavItem to="/chats" label="Chats" icon={MessageCircle} />
      <NavItem to="/profile" label="Profile" icon={User} />
    </nav>
  );
}

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
          isActive ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
          <span className="text-[10px] font-semibold">{label}</span>
        </>
      )}
    </NavLink>
  );
}
