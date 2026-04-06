/**
 * src/services/firebase.js
 *
 * Firebase initialisation and helper functions for TocToc web.
 *
 * SETUP: Replace every YOUR_* placeholder with the values from your
 * Firebase project console (Project settings → Your apps → SDK setup).
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// ---------------------------------------------------------------------------
// Firebase project configuration – replace placeholders before running.
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

/** Firebase Auth instance */
export const auth = getAuth(app);

/** Firestore database instance */
export const db = getFirestore(app);

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

/**
 * Signs the current device in anonymously and returns the Firebase User.
 * If a session already exists it is re-used automatically.
 *
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function signInAnonymouslyAndGetUser() {
  try {
    const credential = await signInAnonymously(auth);
    return credential.user;
  } catch (error) {
    console.error('[firebase] signInAnonymouslyAndGetUser error:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Firestore helpers
// ---------------------------------------------------------------------------

/**
 * Writes a new post document to the `posts` collection.
 *
 * @param {Object} postData
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export async function createPost(postData) {
  try {
    const now = new Date();
    const expiresAt = new Timestamp(
      Math.floor(now.getTime() / 1000) + 24 * 60 * 60,
      0,
    );

    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      expiresAt,
    });

    return docRef;
  } catch (error) {
    console.error('[firebase] createPost error:', error);
    throw error;
  }
}

/**
 * Returns an existing chat document between `postId` and `responderId`,
 * or creates a new one if none exists.
 *
 * @param {string} postId
 * @param {string} responderId
 * @returns {Promise<string>} The chat document ID
 */
export async function getOrCreateChat(postId, responderId) {
  try {
    const chatId = `${postId}_${responderId}`;
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        postId,
        responderId,
        createdAt: serverTimestamp(),
      });
    }

    return chatId;
  } catch (error) {
    console.error('[firebase] getOrCreateChat error:', error);
    throw error;
  }
}

/**
 * Writes a new sponsored post document to the `sponsored_posts` collection.
 *
 * @param {Object} postData
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export async function createSponsoredPost(postData) {
  try {
    const docRef = await addDoc(collection(db, 'sponsored_posts'), {
      ...postData,
      isSponsored: true,
      approved: false,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error('[firebase] createSponsoredPost error:', error);
    throw error;
  }
}
