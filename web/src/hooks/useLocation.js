/**
 * src/hooks/useLocation.js
 *
 * Custom React hook that uses the browser Geolocation API to get the
 * user's current position.
 *
 * Returns:
 *  - location : { latitude, longitude } | null
 *  - error    : string | null
 *  - loading  : boolean
 */
import { useState, useEffect } from 'react';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        console.error('[useLocation] error:', err);
        const message =
          err.code === 1
            ? 'Location permission denied. Please enable it in your browser settings.'
            : 'Unable to retrieve location. Please try again.';
        setError(message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return { location, error, loading };
}
