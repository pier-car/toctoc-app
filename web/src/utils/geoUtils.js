/**
 * src/utils/geoUtils.js
 *
 * Geographic utility functions for TocToc's hyper-local geofencing.
 */

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula.
 *
 * @param {{ latitude: number, longitude: number }} coord1
 * @param {{ latitude: number, longitude: number }} coord2
 * @returns {number} Distance in metres
 */
export function haversineDistance(coord1, coord2) {
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Returns true when `postCoord` falls within `radiusMeters` of `userCoord`.
 *
 * @param {{ latitude: number, longitude: number }} userCoord
 * @param {{ latitude: number, longitude: number }} postCoord
 * @param {number} [radiusMeters=100]
 * @returns {boolean}
 */
export function isWithinRadius(userCoord, postCoord, radiusMeters = 100) {
  return haversineDistance(userCoord, postCoord) <= radiusMeters;
}
