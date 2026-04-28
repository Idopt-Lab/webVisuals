import { useEffect, useState } from 'react';
import { fetchOdRoutes, type OdRoute } from '@/lib/api';

export function useOdRoutes() {
  const [pairs, setPairs] = useState<OdRoute[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOdRoutes()
      .then((payload) => {
        if (cancelled) return;
        setPairs(payload.pairs);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load OD routes');
        setPairs(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { pairs, loading, error };
}
