/**
 * src/utils/timeUtils.js
 *
 * Time-formatting helpers used throughout TocToc's UI to display
 * post age, remaining lifetime, and expiry warnings.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Returns a Firestore Timestamp that is exactly 24 hours after `createdAt`.
 *
 * @param {import('firebase/firestore').Timestamp} createdAt
 * @returns {import('firebase/firestore').Timestamp}
 */
export function getExpiresAt(createdAt) {
  const seconds = createdAt.seconds + 24 * 60 * 60;
  return new Timestamp(seconds, createdAt.nanoseconds);
}

/**
 * Returns a human-readable expiry countdown string.
 *
 * Examples: "Expires in 3h 20m", "Expires in 45m", "Expiring soon"
 *
 * @param {import('firebase/firestore').Timestamp} expiresAt
 * @returns {string}
 */
export function getTimeRemaining(expiresAt) {
  if (!expiresAt) return '';

  const now = Date.now();
  const expiresMs = expiresAt.toMillis();
  const diffMs = expiresMs - now;

  if (diffMs <= 0) return 'Expired';

  const totalMinutes = Math.floor(diffMs / 60_000);

  if (totalMinutes < 10) return 'Expiring soon';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `Expires in ${minutes}m`;
  if (minutes === 0) return `Expires in ${hours}h`;
  return `Expires in ${hours}h ${minutes}m`;
}

/**
 * Returns a relative human-readable string for when `createdAt` occurred.
 *
 * Examples: "just now", "2 min ago", "1 hr ago", "3 hrs ago"
 *
 * @param {import('firebase/firestore').Timestamp | null} createdAt
 * @returns {string}
 */
export function formatRelativeTime(createdAt) {
  if (!createdAt) return '';

  const now = Date.now();
  const createdMs =
    createdAt instanceof Timestamp ? createdAt.toMillis() : createdAt;
  const diffMs = now - createdMs;

  if (diffMs < 60_000) return 'just now';

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? '1 hr ago' : `${hours} hrs ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}
