import { useState, useCallback, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { INITIAL_VIEW_STATE, MAP_STYLE } from './constants';
import { buildAirRouteLayers, buildChoroplethLayer } from './layers';
import Tooltip from './Tooltip';
import type { MetricConfig } from '@/lib/colors';
import type { AirRoute, CountyDataMap, MapType } from '@/lib/api';

interface MapViewProps {
  metric: MetricConfig;
  geoJson: GeoJSON.FeatureCollection | null;
  data: CountyDataMap | null;
  mapType: MapType;
  airRoutes: AirRoute[] | null;
}

interface HoverInfo {
  x: number;
  y: number;
  title: string;
  lines: string[];
}

export default function MapView({ metric, geoJson, data, mapType, airRoutes }: MapViewProps) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const deckRef = useRef<any>(null);

  // Listen for zoom/reset events from ZoomControls
  useEffect(() => {
    const onZoom = (e: Event) => {
      const delta = (e as CustomEvent).detail as number;
      setViewState((vs) => ({
        ...vs,
        zoom: Math.min(14, Math.max(3, vs.zoom + delta)),
      }));
    };
    const onReset = () => setViewState(INITIAL_VIEW_STATE);
    window.addEventListener('map-zoom', onZoom);
    window.addEventListener('map-reset', onReset);
    return () => {
      window.removeEventListener('map-zoom', onZoom);
      window.removeEventListener('map-reset', onReset);
    };
  }, []);

  const onCountyHover = useCallback(
    (info: any) => {
      if (info.object) {
        const props = info.object.properties;
        const fips = info.object.id as string;
        const record = data?.[fips] ?? null;
        const lines = record
          ? [
              `${metric.label}: ${metric.format((record as any)[metric.key])}`,
              `Population: ${record.population.toFixed(1)}K`,
              `Total HH: ${record.hh_total.toFixed(1)}K`,
            ]
          : ['No data'];
        setHoverInfo({
          x: info.x,
          y: info.y,
          title: `${props.NAME || props.name || `FIPS ${fips}`}${props.STATE ? `, ${props.STATE}` : ''}`,
          lines,
        });
      } else {
        setHoverInfo(null);
      }
    },
    [data, metric],
  );

  const onAirHover = useCallback((info: any) => {
    const obj = info.object;
    if (!obj) {
      setHoverInfo(null);
      return;
    }
    if ('origin' in obj && 'dest' in obj) {
      const r = obj as AirRoute;
      setHoverInfo({
        x: info.x,
        y: info.y,
        title: `${r.origin} → ${r.dest}`,
        lines: [
          `Seats: ${r.seats_supply.toLocaleString()}`,
          `Passengers: ${r.pax_supply.toLocaleString()}`,
          `Load factor: ${(r.load_factor * 100).toFixed(1)}%`,
        ],
      });
      return;
    }
    if ('code' in obj) {
      setHoverInfo({
        x: info.x,
        y: info.y,
        title: `${obj.code}`,
        lines: [`Network volume: ${Math.round(obj.volume).toLocaleString()}`],
      });
      return;
    }
    setHoverInfo(null);
  }, []);

  const layers = mapType === 'counties'
    ? (geoJson && data ? [buildChoroplethLayer(geoJson, data, metric.key, onCountyHover)] : [])
    : (mapType === 'air_routes' && airRoutes ? buildAirRouteLayers(airRoutes, onAirHover) : []);

  return (
    <DeckGL
      ref={deckRef}
      viewState={viewState}
      onViewStateChange={({ viewState: vs }: any) => setViewState(vs)}
      controller={true}
      layers={layers}
      style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
    >
      <Map mapStyle={MAP_STYLE} reuseMaps />
      {hoverInfo && <Tooltip x={hoverInfo.x} y={hoverInfo.y} title={hoverInfo.title} lines={hoverInfo.lines} />}
    </DeckGL>
  );
}
