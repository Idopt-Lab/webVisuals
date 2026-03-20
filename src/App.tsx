import { useState } from 'react';
import { MapView } from '@/components/map';
import Nav from '@/components/Nav';
import ScaleLegend from '@/components/map/ScaleLegend';
import ZoomControls from '@/components/map/ZoomControls';
import { METRICS, type MetricConfig } from '@/lib/colors';
import { useCountyData } from '@/hooks/useCountyData';

function App() {
  const [year, setYear] = useState(2020);
  const [metric, setMetric] = useState<MetricConfig>(METRICS[0]);
  const { geoJson, data } = useCountyData(year);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Nav
        year={year}
        onYearChange={setYear}
        metric={metric}
        onMetricChange={setMetric}
      />
      <MapView metric={metric} geoJson={geoJson} data={data} />
      <div className="absolute bottom-6 left-6 z-50">
        <ScaleLegend data={data} metric={metric} />
      </div>
      <div className="absolute bottom-6 right-6 z-50">
        <ZoomControls />
      </div>
    </div>
  );
}

export default App;
