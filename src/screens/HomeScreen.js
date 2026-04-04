/**
 * src/screens/HomeScreen.js
 *
 * The main feed screen for TocToc.
 *
 * - Requests the user's location via `useLocation`.
 * - Subscribes to nearby, non-expired posts via `usePosts`.
 * - Renders a pull-to-refresh FlatList of PostCard components.
 * - Shows a loading indicator while location / posts are resolving.
 * - Shows EmptyFeed when no nearby posts exist.
 * - Navigates to ChatScreen when a post card is tapped.
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

import useLocation from '../hooks/useLocation';
import usePosts from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import EmptyFeed from '../components/EmptyFeed';

export default function HomeScreen({ navigation }) {
  const { location, error: locationError, loading: locationLoading } = useLocation();
  const { posts, loading: postsLoading, error: postsError } = usePosts(location);
  const [refreshing, setRefreshing] = useState(false);

  const isLoading = locationLoading || postsLoading;
  const error = locationError || postsError;

  // Pull-to-refresh just shows a brief spinner; the Firestore listener
  // already keeps data fresh in real time.
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handlePostPress = useCallback(
    (post) => {
      navigation.navigate('Chat', { postId: post.id, post });
    },
    [navigation],
  );

  const navigateToNewPost = useCallback(() => {
    navigation.navigate('Post');
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }) => <PostCard post={item} onPress={() => handlePostPress(item)} />,
    [handlePostPress],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TocToc 🔔</Text>
        <Text style={styles.headerSubtitle}>Building Bubble • 100m</Text>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Finding your building…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>📍</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={posts.length === 0 ? styles.emptyContainer : styles.list}
          ListEmptyComponent={<EmptyFeed onCreatePost={navigateToNewPost} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6C63FF"
              colors={['#6C63FF']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    lineHeight: 21,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
  },
});
