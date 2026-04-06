/**
 * src/utils/timeUtils.js
 *
 * Time-formatting helpers used throughout TocToc's UI.
 */
import { Timestamp } from 'firebase/firestore';

/**
 * Returns a human-readable expiry countdown string.
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
