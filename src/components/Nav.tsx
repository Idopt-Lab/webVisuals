import { METRICS, type MetricConfig } from '@/lib/colors';
import type { MapType } from '@/lib/api';

interface NavProps {
  year: number;
  onYearChange: (year: number) => void;
  metric: MetricConfig;
  onMetricChange: (metric: MetricConfig) => void;
  mapType: MapType;
  onMapTypeChange: (mapType: MapType) => void;
}

function Nav({ year, onYearChange, metric, onMetricChange, mapType, onMapTypeChange }: NavProps) {
  return (
    <div className="absolute top-0 left-0 z-50 flex w-full items-center justify-between px-5 py-4">
      {/* Logo */}
      <h1 className="rounded-full border border-white/15 bg-black/50 px-5 py-2 text-base font-semibold tracking-wide text-white shadow-lg backdrop-blur-xl">
        IDOpt Lab
      </h1>

      {/* Controls group */}
      <div className="flex items-center gap-2">
        <div className="rounded-full border border-white/15 bg-black/50 shadow-lg backdrop-blur-xl">
          <select
            value={mapType}
            onChange={(e) => onMapTypeChange(e.target.value as MapType)}
            className="cursor-pointer appearance-none rounded-full bg-transparent px-4 py-2 text-sm font-medium text-white outline-none"
          >
            <option value="counties" className="bg-gray-900 text-white">Counties</option>
            <option value="air_routes" className="bg-gray-900 text-white">Air Routes (T100)</option>
            <option value="road_routes" className="bg-gray-900 text-white">Road Routes (Soon)</option>
          </select>
        </div>

        {/* Year control */}
        <div className={`flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-1.5 py-1 shadow-lg backdrop-blur-xl ${mapType !== 'counties' ? 'opacity-50' : ''}`}>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            disabled={mapType !== 'counties'}
            onClick={() => onYearChange(Math.max(1995, year - 1))}
          >
            ‹
          </button>
          <input
            type="range"
            min={1995}
            max={2050}
            value={year}
            disabled={mapType !== 'counties'}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/20 accent-blue-400 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <span className="min-w-10 text-center text-sm font-bold tabular-nums text-white">
            {year}
          </span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            disabled={mapType !== 'counties'}
            onClick={() => onYearChange(Math.min(2050, year + 1))}
          >
            ›
          </button>
        </div>

        {/* Metric selector */}
        <div className={`rounded-full border border-white/15 bg-black/50 shadow-lg backdrop-blur-xl ${mapType !== 'counties' ? 'opacity-50' : ''}`}>
          <select
            value={metric.key}
            disabled={mapType !== 'counties'}
            onChange={(e) => {
              const m = METRICS.find((m) => m.key === e.target.value)!;
              onMetricChange(m);
            }}
            className="cursor-pointer appearance-none rounded-full bg-transparent px-4 py-2 text-sm font-medium text-white outline-none"
          >
            {METRICS.map((m) => (
              <option key={m.key} value={m.key} className="bg-gray-900 text-white">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Nav;
