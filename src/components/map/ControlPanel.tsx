import { METRICS, type MetricConfig, sequentialColor } from '@/lib/colors';

interface ControlPanelProps {
  year: number;
  onYearChange: (year: number) => void;
  metric: MetricConfig;
  onMetricChange: (metric: MetricConfig) => void;
  loading: boolean;
}

export default function ControlPanel({
  year,
  onYearChange,
  metric,
  onMetricChange,
  loading,
}: ControlPanelProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-white/20 bg-black/60 px-6 py-4 shadow-2xl backdrop-blur-xl">
      {/* Year slider */}
      <div className="flex flex-col items-center gap-1">
        <label className="text-xs font-medium text-white/70">Year</label>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full bg-white/10 px-2 py-0.5 text-sm text-white hover:bg-white/20"
            onClick={() => onYearChange(Math.max(1995, year - 1))}
          >
            ‹
          </button>
          <span className="min-w-[3rem] text-center text-lg font-bold tabular-nums text-white">
            {year}
          </span>
          <button
            className="rounded-full bg-white/10 px-2 py-0.5 text-sm text-white hover:bg-white/20"
            onClick={() => onYearChange(Math.min(2050, year + 1))}
          >
            ›
          </button>
        </div>
        <input
          type="range"
          min={1995}
          max={2050}
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-40 accent-blue-400"
        />
      </div>

      {/* Divider */}
      <div className="h-12 w-px bg-white/20" />

      {/* Metric selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white/70">Metric</label>
        <select
          value={metric.key}
          onChange={(e) => {
            const m = METRICS.find((m) => m.key === e.target.value)!;
            onMetricChange(m);
          }}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white outline-none backdrop-blur-sm focus:border-blue-400"
        >
          {METRICS.map((m) => (
            <option key={m.key} value={m.key} className="bg-gray-900 text-white">
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}

      {/* Legend */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white/70">Scale</label>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/60">Low</span>
          <div className="flex h-3 w-24 overflow-hidden rounded-sm">
            {Array.from({ length: 20 }).map((_, i) => {
              const [r, g, b] = sequentialColor(i / 19);
              return (
                <div
                  key={i}
                  className="h-full flex-1"
                  style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-white/60">High</span>
        </div>
      </div>
    </div>
  );
}
