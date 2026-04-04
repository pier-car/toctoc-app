/**
 * src/screens/NewPostScreen.js
 *
 * Post creation form for TocToc.
 *
 * - Category selector row using CategoryPill components.
 * - Multiline text input (max 280 chars) with live character counter.
 * - Optional anonymous display-name field.
 * - Submits via `createPost()` from the Firebase service, attaching
 *   the user's current location.
 * - Validates: category selected + non-empty message.
 * - Shows success feedback and navigates back to Feed on submission.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { createPost } from '../services/firebase';
import { auth } from '../services/firebase';
import useLocation from '../hooks/useLocation';
import CategoryPill from '../components/CategoryPill';

const CATEGORIES = [
  { id: 'package', emoji: '📦', label: 'Package', color: '#4A90E2' },
  { id: 'borrow', emoji: '🛠️', label: 'Borrow', color: '#F5A623' },
  { id: 'groupbuy', emoji: '🍕', label: 'Group Buy', color: '#E74C3C' },
  { id: 'info', emoji: 'ℹ️', label: 'Building Info', color: '#95A5A6' },
];

const MAX_CHARS = 280;

export default function NewPostScreen({ navigation }) {
  const { location } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!selectedCategory) {
      Alert.alert('Missing category', 'Please select a category for your post.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Empty message', 'Please write something before posting.');
      return;
    }

    if (!location) {
      Alert.alert(
        'Location unavailable',
        'We need your location to post. Please allow location access and try again.',
      );
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

      Alert.alert('Posted! 🎉', 'Your message is live for the next 24 hours.', [
        {
          text: 'See Feed',
          onPress: () => navigation.navigate('Feed'),
        },
      ]);

      // Reset form
      setSelectedCategory(null);
      setMessage('');
      setAuthorName('');
    } catch (err) {
      Alert.alert('Error', 'Could not submit your post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedCategory, message, authorName, location, navigation]);

  const charsLeft = MAX_CHARS - message.length;
  const isOverLimit = charsLeft < 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text style={styles.screenTitle}>New Post</Text>
          <Text style={styles.screenSubtitle}>
            Your neighbors will see this for 24 hours.
          </Text>

          {/* Category selector */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
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
          </View>

          {/* Message input */}
          <Text style={styles.label}>Message</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={[styles.textArea, isOverLimit && styles.textAreaError]}
              placeholder="What do you need? Be concise and friendly 🙂"
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={MAX_CHARS + 50} // soft cap enforced via counter
              value={message}
              onChangeText={setMessage}
              accessibilityLabel="Post message input"
            />
            <Text style={[styles.charCounter, isOverLimit && styles.charCounterError]}>
              {charsLeft}
            </Text>
          </View>

          {/* Display name */}
          <Text style={styles.label}>
            Your name{' '}
            <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="A Neighbor"
            placeholderTextColor="#9CA3AF"
            value={authorName}
            onChangeText={setAuthorName}
            maxLength={32}
            accessibilityLabel="Display name input"
          />

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.85}
            accessibilityLabel="Submit post"
            accessibilityRole="button"
            disabled={submitting || isOverLimit}
            style={[
              styles.submitButton,
              (submitting || isOverLimit) && styles.submitButtonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Post to Building 🔔</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  optional: {
    fontWeight: '400',
    textTransform: 'none',
    letterSpacing: 0,
    color: '#9CA3AF',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  textAreaWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 20,
  },
  textArea: {
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  textAreaError: {
    color: '#EF4444',
  },
  charCounter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  charCounterError: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 28,
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
