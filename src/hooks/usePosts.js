/**
 * src/hooks/usePosts.js
 *
 * Custom React hook that subscribes to the Firestore `posts` collection
 * in real time and applies two client-side filters:
 *
 *  1. Geographic – only posts within 100 m of the user's location
 *     (using Haversine formula from geoUtils.js).
 *  2. Temporal   – only posts whose `expiresAt` is still in the future.
 *
 * Returns:
 *  - posts   : Array of filtered post objects (with `id` field injected)
 *  - loading : boolean
 *  - error   : string | null
 */
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { isWithinRadius } from '../utils/geoUtils';

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {string} authorName
 * @property {string} authorId
 * @property {{ latitude: number, longitude: number }} coordinates
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} expiresAt
 */

/**
 * @typedef {Object} PostsResult
 * @property {Post[]} posts
 * @property {boolean} loading
 * @property {string | null} error
 */

/**
 * Subscribes to all posts and filters to those nearby and not yet expired.
 *
 * @param {{ latitude: number, longitude: number } | null} userLocation
 * @returns {PostsResult}
 */
export default function usePosts(userLocation) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userLocation) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const now = Date.now();

        const filtered = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((post) => {
            // Filter out expired posts
            if (!post.expiresAt) return false;
            if (post.expiresAt.toMillis() <= now) return false;

            // Filter by geographic radius
            if (!post.coordinates) return false;
            return isWithinRadius(userLocation, post.coordinates);
          });

        setPosts(filtered);
        setLoading(false);
      },
      (err) => {
        console.error('[usePosts] Firestore subscription error:', err);
        setError('Failed to load posts. Please check your connection.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userLocation]);

  return { posts, loading, error };
}
