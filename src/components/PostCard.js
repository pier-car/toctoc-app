/**
 * src/components/PostCard.js
 *
 * Premium animated card component that renders a single TocToc post.
 *
 * Visual features:
 *  - White background with 16px rounded corners and a subtle shadow
 *  - 4px left accent bar coloured by category
 *  - Category emoji + label pill at the top
 *  - Message body (max 3 lines, with "Read more" expand)
 *  - Footer row: author · relative time · time remaining · reply icon
 *  - Fade + translateY entrance animation on first render
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { formatRelativeTime, getTimeRemaining } from '../utils/timeUtils';

/** Map each category slug to its accent colour and display metadata */
const CATEGORY_META = {
  package: { color: '#4A90E2', emoji: '📦', label: 'Package' },
  borrow: { color: '#F5A623', emoji: '🛠️', label: 'Borrow' },
  groupbuy: { color: '#E74C3C', emoji: '🍕', label: 'Group Buy' },
  info: { color: '#95A5A6', emoji: 'ℹ️', label: 'Building Info' },
};

/**
 * @param {Object}   props
 * @param {import('../hooks/usePosts').Post} props.post
 * @param {Function} props.onPress - Called when the card (or reply icon) is tapped
 */
export default function PostCard({ post, onPress }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const meta = CATEGORY_META[post.category] ?? CATEGORY_META.info;

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY }] }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityLabel={`Post: ${post.message}`}
        accessibilityRole="button"
        style={styles.card}
      >
        {/* Accent bar */}
        <View style={[styles.accentBar, { backgroundColor: meta.color }]} />

        {/* Content */}
        <View style={styles.content}>
          {/* Category pill */}
          <View style={[styles.categoryPill, { backgroundColor: meta.color + '18' }]}>
            <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>

          {/* Message */}
          <Text
            style={styles.message}
            numberOfLines={expanded ? undefined : 3}
            onTextLayout={(e) => {
              if (e.nativeEvent.lines.length > 3 && !expanded) {
                /* more than 3 lines available */
              }
            }}
          >
            {post.message}
          </Text>

          {!expanded && post.message.length > 120 && (
            <TouchableOpacity onPress={() => setExpanded(true)}>
              <Text style={styles.readMore}>Read more</Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerMeta} numberOfLines={1}>
              {post.authorName || 'A Neighbor'}
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.footerMeta}>
              {formatRelativeTime(post.createdAt)}
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text style={[styles.footerMeta, styles.expiry]}>
              {getTimeRemaining(post.expiresAt)}
            </Text>

            <View style={styles.spacer} />

            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.7}
              accessibilityLabel="Reply to post"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MessageCircle size={20} color="#6C63FF" strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 10,
  },
  readMore: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dot: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 4,
  },
  expiry: {
    color: '#F59E0B',
  },
  spacer: {
    flex: 1,
  },
});
