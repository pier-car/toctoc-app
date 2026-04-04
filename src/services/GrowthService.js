/**
 * src/services/GrowthService.js
 *
 * Viral growth utilities for TocToc.
 *
 * Exports:
 *  - generateInviteUrl(buildingId)          – returns a deep-link invite URL
 *  - generateFlyerShareMessage(inviteUrl)   – returns the flyer body text
 *  - trackInviteSent(buildingId, userId)    – logs an invite event to Firestore
 *  - getBuildingInviteStats(buildingId)     – returns total invite count for a building
 */
import {
  collection,
  addDoc,
  getCountFromServer,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Returns the deep-link invite URL for a given building.
 *
 * @param {string} buildingId - Firestore document ID of the building
 * @returns {string}
 */
export function generateInviteUrl(buildingId) {
  const encoded = encodeURIComponent(buildingId);
  return `https://toctoc.app/join?building=${encoded}`;
}

/**
 * Returns the Italian flyer message text that includes the invite URL.
 *
 * @param {string} inviteUrl
 * @returns {string}
 */
export function generateFlyerShareMessage(inviteUrl) {
  return (
    'Ciao Vicino! 👋\n\n' +
    'Ho creato la bacheca digitale del nostro palazzo su TocToc.\n' +
    'Scansiona il QR code per aiutarci a vicenda con pacchi, prestiti e tanto altro.\n\n' +
    `Unisciti qui: ${inviteUrl}\n\n` +
    '🔔 TocToc — la bacheca del tuo condominio'
  );
}

/**
 * Writes an invite_sent event to Firestore for analytics purposes.
 *
 * @param {string} buildingId
 * @param {string} userId - Anonymous UID of the user who shared the flyer
 * @returns {Promise<void>}
 */
export async function trackInviteSent(buildingId, userId) {
  try {
    await addDoc(collection(db, 'invite_events'), {
      buildingId,
      userId,
      type: 'flyer_shared',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[GrowthService] trackInviteSent error:', error);
  }
}

/**
 * Returns the total number of invite events for a building.
 *
 * @param {string} buildingId
 * @returns {Promise<number>}
 */
export async function getBuildingInviteStats(buildingId) {
  try {
    const q = query(
      collection(db, 'invite_events'),
      where('buildingId', '==', buildingId),
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('[GrowthService] getBuildingInviteStats error:', error);
    return 0;
  }
}
