/**
 * src/components/EmptyFeed.js
 *
 * Rendered by HomeScreen when no nearby, non-expired posts are available.
 * Encourages the user to create the first post for their building.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * @param {Object}   props
 * @param {Function} props.onCreatePost - Navigate to the New Post tab
 */
export default function EmptyFeed({ onCreatePost }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🤫</Text>
      <Text style={styles.title}>It's quiet around here</Text>
      <Text style={styles.subtitle}>
        Be the first to post something for your building!
      </Text>
      <TouchableOpacity
        onPress={onCreatePost}
        activeOpacity={0.85}
        accessibilityLabel="Create a Post"
        accessibilityRole="button"
        style={styles.button}
      >
        <Text style={styles.buttonText}>Create a Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
