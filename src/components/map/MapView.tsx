import { useState, useCallback, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { INITIAL_VIEW_STATE, MAP_STYLE } from './constants';
import { buildChoroplethLayer } from './layers';
import Tooltip from './Tooltip';
import type { MetricConfig } from '@/lib/colors';
import type { CountyDataMap, CountyRecord } from '@/lib/api';

interface MapViewProps {
  metric: MetricConfig;
  geoJson: GeoJSON.FeatureCollection | null;
  data: CountyDataMap | null;
}

interface HoverInfo {
  x: number;
  y: number;
  countyName: string;
  stateName: string;
  record: CountyRecord | null;
}

export default function MapView({ metric, geoJson, data }: MapViewProps) {
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

  const onHover = useCallback(
    (info: any) => {
      if (info.object) {
        const props = info.object.properties;
        const fips = info.object.id as string;
        setHoverInfo({
          x: info.x,
          y: info.y,
          countyName: props.NAME || props.name || `FIPS ${fips}`,
          stateName: props.STATE || '',
          record: data?.[fips] ?? null,
        });
      } else {
        setHoverInfo(null);
      }
    },
    [data],
  );

  const layers =
    geoJson && data ? [buildChoroplethLayer(geoJson, data, metric.key, onHover)] : [];

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
      {hoverInfo && <Tooltip {...hoverInfo} metric={metric} />}
    </DeckGL>
  );
}
