import { useEffect, useState } from 'react';
import { fetchAirRoutes, type AirRoute } from '@/lib/api';

export function useAirRoutes(limit = 350) {
  const [routes, setRoutes] = useState<AirRoute[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAirRoutes(limit)
      .then((payload) => {
        if (cancelled) return;
        setRoutes(payload.routes);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load air routes');
        setRoutes(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { routes, loading, error };
}
