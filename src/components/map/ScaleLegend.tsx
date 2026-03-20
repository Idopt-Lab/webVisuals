import { sequentialColor, type MetricConfig } from '@/lib/colors';
import type { CountyDataMap } from '@/lib/api';
import { getRange } from './layers';

interface ScaleLegendProps {
  data: CountyDataMap | null;
  metric: MetricConfig;
}

export default function ScaleLegend({ data, metric }: ScaleLegendProps) {
  const [min, max] = data ? getRange(data, metric.key) : [0, 0];

  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 shadow-lg backdrop-blur-xl">
      <span className="text-[11px] font-medium text-white/60">{metric.label}</span>
      <div className="flex h-2.5 w-44 overflow-hidden rounded-full">
        {Array.from({ length: 32 }).map((_, i) => {
          const [r, g, b] = sequentialColor(i / 31);
          return (
            <div
              key={i}
              className="h-full flex-1"
              style={{ backgroundColor: `rgb(${r},${g},${b})` }}
            />
          );
        })}
      </div>
      <div className="flex justify-between">
        <span className="text-[11px] font-semibold tabular-nums text-white/80">{metric.format(min)}</span>
        <span className="text-[11px] font-semibold tabular-nums text-white/80">{metric.format(max)}</span>
      </div>
    </div>
  );
}
