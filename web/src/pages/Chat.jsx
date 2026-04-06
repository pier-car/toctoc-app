/**
 * src/pages/Chat.jsx
 *
 * Real-time anonymous 1-to-1 chat page for TocToc web.
 *
 * - Receives postId from URL params and post data from navigation state.
 * - Creates/fetches the chat document, subscribes to messages.
 * - Renders sent messages right-aligned (purple) and received left-aligned (gray).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Send, ArrowLeft } from 'lucide-react';

import { db, auth, getOrCreateChat, signInAnonymouslyAndGetUser } from '../services/firebase';

export default function ChatPage() {
  const { chatId: chatIdParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  const postId = chatIdParam;

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    let unsubscribeMessages = null;

    async function init() {
      try {
        let user = auth.currentUser;
        if (!user) {
          user = await signInAnonymouslyAndGetUser();
        }
        setCurrentUserId(user.uid);

        const id = await getOrCreateChat(postId, user.uid);
        setChatId(id);

        const messagesQuery = query(
          collection(db, 'chats', id, 'messages'),
          orderBy('createdAt', 'asc'),
        );

        unsubscribeMessages = onSnapshot(
          messagesQuery,
          (snapshot) => {
            const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            setLoading(false);
          },
          (err) => {
            console.error('[ChatPage] messages subscription error:', err);
            setLoading(false);
          },
        );
      } catch (err) {
        console.error('[ChatPage] init error:', err);
        setLoading(false);
      }
    }

    init();

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [postId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !chatId || sending) return;

    setSending(true);
    setInputText('');

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[ChatPage] send error:', err);
    } finally {
      setSending(false);
    }
  }, [inputText, chatId, currentUserId, sending]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const CATEGORY_EMOJI = { package: '📦', borrow: '🛠️', groupbuy: '🍕', info: 'ℹ️' };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-bold text-gray-900 truncate">
            {post
              ? `${CATEGORY_EMOJI[post.category] ?? '💬'}  ${post.message.slice(0, 40)}${post.message.length > 40 ? '…' : ''}`
              : 'Chat'}
          </h2>
          <p className="text-xs text-gray-400">Anonymous chat</p>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 pb-2 space-y-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center pt-16">
              <p className="text-gray-400 text-base">👋 Say hello to your neighbor!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-[18px] text-[15px] leading-relaxed ${
                    isMine
                      ? 'bg-brand text-white rounded-br-[4px]'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-[4px]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-end gap-2 px-3 py-2.5 bg-white border-t border-gray-100 flex-shrink-0 pb-safe">
        <textarea
          className="flex-1 bg-gray-100 rounded-[22px] px-4 py-2.5 text-[15px] text-gray-900 resize-none outline-none max-h-28 leading-relaxed"
          placeholder="Type a message…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || sending}
          aria-label="Send message"
          className={`w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0 transition-all ${
            !inputText.trim() || sending ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#5A52E0] active:scale-95'
          }`}
        >
          <Send size={17} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
