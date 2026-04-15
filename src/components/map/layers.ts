import { ArcLayer, GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { sequentialColor, NO_DATA_COLOR } from '@/lib/colors';
import type { AirRoute, CountyDataMap } from '@/lib/api';

/**
 * Compute min/max for a metric across all counties to normalise the color scale.
 */
export function getRange(data: CountyDataMap, metricKey: string): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const rec of Object.values(data)) {
    const v = (rec as any)[metricKey] as number | undefined;
    if (v == null) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [Math.max(0, min), max];
}

export function buildChoroplethLayer(
  geoJson: GeoJSON.FeatureCollection,
  data: CountyDataMap,
  metricKey: string,
  onHover: (info: any) => void,
) {
  const [min, max] = getRange(data, metricKey);

  return new GeoJsonLayer({
    id: 'counties-choropleth',
    data: geoJson,
    pickable: true,
    stroked: true,
    filled: true,
    lineWidthMinPixels: 0.3,
    getLineColor: [80, 80, 80, 100],
    getFillColor: (d: any) => {
      const fips = d.id as string;
      const rec = data[fips];
      if (!rec) return NO_DATA_COLOR;
      const v = (rec as any)[metricKey] as number;
      if (v == null) return NO_DATA_COLOR;
      // Log scale for better visual spread
      const logMin = Math.log1p(min);
      const logMax = Math.log1p(max);
      const logRange = logMax - logMin || 1;
      const t = (Math.log1p(v) - logMin) / logRange;
      return sequentialColor(t);
    },
    getLineWidth: 1,
    onHover,
    updateTriggers: {
      getFillColor: [data, metricKey],
    },
    transitions: {
      getFillColor: 300,
    },
  });
}

type AirportNode = {
  code: string;
  lat: number;
  lon: number;
  volume: number;
};

function routeWeight(r: AirRoute): number {
  return Math.max(r.seats_supply, r.pax_supply);
}

function buildAirportNodes(routes: AirRoute[]): AirportNode[] {
  const nodes = new Map<string, AirportNode>();
  for (const r of routes) {
    const w = routeWeight(r);
    const origin = nodes.get(r.origin) ?? { code: r.origin, lat: r.origin_lat, lon: r.origin_lon, volume: 0 };
    origin.volume += w;
    nodes.set(r.origin, origin);

    const dest = nodes.get(r.dest) ?? { code: r.dest, lat: r.dest_lat, lon: r.dest_lon, volume: 0 };
    dest.volume += w;
    nodes.set(r.dest, dest);
  }
  return [...nodes.values()];
}

export function buildAirRouteLayers(routes: AirRoute[], onHover: (info: any) => void) {
  const airportNodes = buildAirportNodes(routes);

  const arcs = new ArcLayer<AirRoute>({
    id: 'air-routes',
    data: routes,
    pickable: true,
    greatCircle: true,
    getSourcePosition: (d) => [d.origin_lon, d.origin_lat],
    getTargetPosition: (d) => [d.dest_lon, d.dest_lat],
    getWidth: (d) => Math.max(0.5, Math.log10(routeWeight(d) + 1) * 0.85),
    getSourceColor: [0, 200, 90, 200],
    getTargetColor: [60, 120, 255, 180],
    onHover,
    updateTriggers: {
      getWidth: [routes.length],
    },
  });

  const airports = new ScatterplotLayer<AirportNode>({
    id: 'airports',
    data: airportNodes,
    pickable: true,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: (d) => Math.max(12000, Math.log10(d.volume + 1) * 13000),
    radiusUnits: 'meters',
    stroked: true,
    lineWidthMinPixels: 1,
    getFillColor: [255, 90, 90, 190],
    getLineColor: [255, 255, 255, 220],
    onHover,
  });

  return [arcs, airports];
}
