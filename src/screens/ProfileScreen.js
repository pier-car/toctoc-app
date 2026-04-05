/**
 * src/screens/ProfileScreen.js
 *
 * Anonymous user profile screen for TocToc.
 *
 * - Displays the first 8 characters of the anonymous UID as a "handle".
 * - Explains the privacy-first philosophy.
 * - "Reset Identity" button calls `signInAnonymouslyAndGetUser()` to
 *   generate a fresh anonymous account.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, signInAnonymouslyAndGetUser } from '../services/firebase';

export default function ProfileScreen() {
  const [userId, setUserId] = useState(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    // Listen for auth state changes; set up listener synchronously so the
    // cleanup always has the correct unsubscribe reference.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });

    // Ensure an anonymous session exists on first render.
    if (!auth.currentUser) {
      signInAnonymouslyAndGetUser().catch((err) => {
        console.error('[ProfileScreen] sign-in error:', err);
      });
    }

    return () => unsubscribe();
  }, []);

  const handleResetIdentity = async () => {
    Alert.alert(
      'Reset Identity?',
      'This will create a completely new anonymous profile. Your current identity will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            try {
              // Sign out first so that Firebase creates a brand-new anonymous account.
              await signOut(auth);
              const user = await signInAnonymouslyAndGetUser();
              setUserId(user.uid);
            } catch (err) {
              Alert.alert('Error', 'Could not reset identity. Please try again.');
            } finally {
              setResetting(false);
            }
          },
        },
      ],
    );
  };

  const handle = userId ? `@${userId.slice(0, 8)}` : '…';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Brand icon */}
        <Text style={styles.brandIcon}>🔔</Text>
        <Text style={styles.appName}>TocToc</Text>

        {/* User handle */}
        <View style={styles.handleContainer}>
          <Text style={styles.handleLabel}>YOUR HANDLE</Text>
          <Text style={styles.handle}>{handle}</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          You're anonymous. Your neighbors know you by your actions, not your name.
        </Text>

        {/* Privacy pills */}
        <View style={styles.pillsRow}>
          {['No sign-up', 'No phone', 'No data sold'].map((text) => (
            <View key={text} style={styles.pill}>
              <Text style={styles.pillText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Reset button */}
        <TouchableOpacity
          onPress={handleResetIdentity}
          activeOpacity={0.85}
          accessibilityLabel="Reset Identity"
          accessibilityRole="button"
          disabled={resetting}
          style={[styles.resetButton, resetting && styles.resetButtonDisabled]}
        >
          {resetting ? (
            <ActivityIndicator color="#6C63FF" />
          ) : (
            <Text style={styles.resetText}>🔄  Reset Identity</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Resetting creates a brand-new anonymous profile. This action cannot be undone.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  brandIcon: {
    fontSize: 56,
    marginBottom: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6C63FF',
    letterSpacing: -0.5,
    marginBottom: 32,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  handleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  handle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pill: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  resetButton: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginBottom: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  resetButtonDisabled: {
    opacity: 0.5,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6C63FF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
