import { GeoJsonLayer } from '@deck.gl/layers';
import { sequentialColor, NO_DATA_COLOR } from '@/lib/colors';
import type { CountyDataMap } from '@/lib/api';

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
