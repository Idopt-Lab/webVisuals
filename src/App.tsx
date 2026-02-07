import { useState, useCallback, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW_STATE = {
  longitude: -98.5,
  latitude: 39.0,
  zoom: 4,
  bearing: 0,
  pitch: 0,
  minZoom: 3,
  maxZoom: 14,
};

const COUNTIES_URL =
  'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';

function App() {
  const [countyData, setCountyData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    name: string;
    state: string;
  } | null>(null);

  useEffect(() => {
    fetch(COUNTIES_URL)
      .then((res) => res.json())
      .then((data: GeoJSON.FeatureCollection) => setCountyData(data));
  }, []);

  const onHover = useCallback((info: any) => {
    if (info.object) {
      const props = info.object.properties;
      setHoverInfo({
        x: info.x,
        y: info.y,
        name: props.NAME || props.name || props.NAMELSAD || `FIPS ${info.object.id}`,
        state: props.STATE || props.state || '',
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  const layers = countyData
    ? [
        new GeoJsonLayer({
          id: 'counties',
          data: countyData,
          pickable: true,
          stroked: true,
          filled: true,
          lineWidthMinPixels: 0.5,
          getLineColor: [100, 100, 100, 180],
          getFillColor: (d: any) => {
            // Color by FIPS code for visual variety
            const fips = Number(d.id || 0);
            const r = (fips * 37) % 200 + 40;
            const g = (fips * 73) % 180 + 40;
            const b = (fips * 113) % 160 + 60;
            return [r, g, b, 160];
          },
          getLineWidth: 1,
          onHover,
          updateTriggers: {
            getFillColor: [countyData],
          },
        }),
      ]
    : [];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Map
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        reuseMaps
      />
      {hoverInfo && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: hoverInfo.x + 12,
            top: hoverInfo.y - 12,
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 4,
            fontSize: 13,
            fontFamily: 'system-ui, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {hoverInfo.name}
          {hoverInfo.state ? ` (${hoverInfo.state})` : ''}
        </div>
      )}
    </DeckGL>
  );
}

export default App;
