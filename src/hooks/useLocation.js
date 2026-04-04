/**
 * src/hooks/useLocation.js
 *
 * Custom React hook that requests foreground location permission via
 * expo-location and continuously exposes the user's current position.
 *
 * Returns:
 *  - location : { latitude, longitude } | null
 *  - error    : string | null
 *  - loading  : boolean
 */
import { useState, useEffect } from 'react';
import * as ExpoLocation from 'expo-location';

/**
 * @typedef {Object} LocationResult
 * @property {{ latitude: number, longitude: number } | null} location
 * @property {string | null} error
 * @property {boolean} loading
 */

/**
 * Requests foreground location permission and returns the device's
 * current geographic position.
 *
 * @returns {LocationResult}
 */
export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function requestLocation() {
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (isMounted) {
            setError('Location permission denied. Please enable it in Settings.');
            setLoading(false);
          }
          return;
        }

        const position = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });

        if (isMounted) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('[useLocation] error:', err);
        if (isMounted) {
          setError('Unable to retrieve location. Please try again.');
          setLoading(false);
        }
      }
    }

    requestLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, error, loading };
}
