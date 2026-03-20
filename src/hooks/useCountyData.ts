import { useState, useEffect } from 'react';
import { fetchCountyGeoJson, fetchYearData, type CountyDataMap } from '@/lib/api';

export function useCountyData(year: number) {
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [data, setData] = useState<CountyDataMap | null>(null);
  const [loading, setLoading] = useState(true);

  // Load geometry once
  useEffect(() => {
    fetchCountyGeoJson().then(setGeoJson);
  }, []);

  // Load data per year
  useEffect(() => {
    setLoading(true);
    fetchYearData(year).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [year]);

  return { geoJson, data, loading };
}
