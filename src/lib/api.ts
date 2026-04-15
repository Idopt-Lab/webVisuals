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

export type MapType = 'counties' | 'air_routes' | 'road_routes';

export interface AirRoute {
  origin: string;
  dest: string;
  origin_lat: number;
  origin_lon: number;
  dest_lat: number;
  dest_lon: number;
  origin_city: string;
  origin_state: string;
  dest_city: string;
  dest_state: string;
  seats_supply: number;
  pax_supply: number;
  load_factor: number;
}

export interface AirRoutesResponse {
  name: string;
  quarter: number;
  count: number;
  returned: number;
  routes: AirRoute[];
}

export async function fetchAirRoutes(limit = 350): Promise<AirRoutesResponse> {
  const res = await fetch(`${BASE}/routes/air?limit=${limit}`);
  return res.json();
}
