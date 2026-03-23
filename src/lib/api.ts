const BASE = import.meta.env.DEV ? '/api' : 'https://api.idoptlab.com/api';

let geojsonCache: GeoJSON.FeatureCollection | null = null;

export async function fetchCountyGeoJson(): Promise<GeoJSON.FeatureCollection> {
  if (geojsonCache) return geojsonCache;
  const res = await fetch(`${BASE}/geojson`);
  geojsonCache = await res.json();
  return geojsonCache!;
}

export interface CountyRecord {
  fips: string;
  name: string;
  state: string;
  'hh_<25K': number;
  'hh_25K-40K': number;
  'hh_40K-60K': number;
  'hh_60K-100K': number;
  'hh_>100K': number;
  hh_total: number;
  population: number;
  totalEmployment: number;
  lodgingEmployment: number;
  retailTrade: number;
}

export type CountyDataMap = Record<string, CountyRecord>;

export async function fetchYearData(year: number): Promise<CountyDataMap> {
  const res = await fetch(`${BASE}/data/${year}`);
  return res.json();
}
