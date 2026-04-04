/**
 * src/screens/ChatScreen.js
 *
 * Real-time anonymous 1-to-1 chat screen for TocToc.
 *
 * - Receives `postId` and `post` via React Navigation route params.
 * - Calls `getOrCreateChat(postId, currentUserId)` to obtain a chat ID.
 * - Subscribes to `chats/{chatId}/messages` (ordered by `createdAt` asc).
 * - Renders messages in a FlatList:
 *     • Sent messages: purple bubble, right-aligned.
 *     • Received messages: light-gray bubble, left-aligned.
 * - Input bar at the bottom with a send button.
 * - Signs in anonymously on mount if no current user exists.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Send } from 'lucide-react-native';

import { db, auth, getOrCreateChat, signInAnonymouslyAndGetUser } from '../services/firebase';

export default function ChatScreen({ route }) {
  const { postId, post } = route.params ?? {};

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const flatListRef = useRef(null);

  // ---------------------------------------------------------------------------
  // Ensure the user is signed in, then initialise the chat document.
  // ---------------------------------------------------------------------------
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
            console.error('[ChatScreen] messages subscription error:', err);
            setLoading(false);
          },
        );
      } catch (err) {
        console.error('[ChatScreen] init error:', err);
        setLoading(false);
      }
    }

    init();

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [postId]);

  // ---------------------------------------------------------------------------
  // Send a message
  // ---------------------------------------------------------------------------
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
      console.error('[ChatScreen] send error:', err);
    } finally {
      setSending(false);
    }
  }, [inputText, chatId, currentUserId, sending]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  const renderMessage = useCallback(
    ({ item }) => {
      const isMine = item.senderId === currentUserId;
      return (
        <View
          style={[
            styles.bubbleWrapper,
            isMine ? styles.bubbleWrapperRight : styles.bubbleWrapperLeft,
          ]}
        >
          <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
            <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
              {item.text}
            </Text>
          </View>
        </View>
      );
    },
    [currentUserId],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>
                👋 Say hello to your neighbor!
              </Text>
            </View>
          }
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            accessibilityLabel="Message input"
          />
          <TouchableOpacity
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!inputText.trim() || sending}
            accessibilityLabel="Send message"
            accessibilityRole="button"
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
          >
            <Send size={18} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  bubbleWrapper: {
    marginBottom: 8,
    maxWidth: '80%',
  },
  bubbleWrapperLeft: {
    alignSelf: 'flex-start',
  },
  bubbleWrapperRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#6C63FF',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bubbleText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 21,
  },
  bubbleTextMine: {
    color: '#FFFFFF',
  },
  emptyChat: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyChatText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    color: '#111827',
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
