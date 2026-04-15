import { useState } from 'react';
import { MapView } from '@/components/map';
import Nav from '@/components/Nav';
import ScaleLegend from '@/components/map/ScaleLegend';
import ZoomControls from '@/components/map/ZoomControls';
import { METRICS, type MetricConfig } from '@/lib/colors';
import type { MapType } from '@/lib/api';
import { useCountyData } from '@/hooks/useCountyData';
import { useAirRoutes } from '@/hooks/useAirRoutes';

function App() {
  const [year, setYear] = useState(2020);
  const [metric, setMetric] = useState<MetricConfig>(METRICS[0]);
  const [mapType, setMapType] = useState<MapType>('counties');
  const { geoJson, data } = useCountyData(year);
  const { routes: airRoutes } = useAirRoutes(350);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Nav
        year={year}
        onYearChange={setYear}
        metric={metric}
        onMetricChange={setMetric}
        mapType={mapType}
        onMapTypeChange={setMapType}
      />
      <MapView metric={metric} geoJson={geoJson} data={data} mapType={mapType} airRoutes={airRoutes} />
      {mapType === 'counties' && <div className="absolute bottom-6 left-6 z-50">
        <ScaleLegend data={data} metric={metric} />
      </div>}
      <div className="absolute bottom-6 right-6 z-50">
        <ZoomControls />
      </div>
      {mapType === 'air_routes' && (
        <div className="absolute bottom-6 left-6 z-50 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-xs text-white/85 shadow-lg backdrop-blur-xl">
          T100 Air Routes: top 350 Q1 routes by seats
        </div>
      )}
      {mapType === 'road_routes' && (
        <div className="absolute bottom-6 left-6 z-50 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-xs text-white/85 shadow-lg backdrop-blur-xl">
          Road routes mode is scaffolded next. Air routes are live now.
        </div>
      )}
    </div>
  );
}

export default App;
