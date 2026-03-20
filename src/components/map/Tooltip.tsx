import type { CountyRecord } from '@/lib/api';
import type { MetricConfig } from '@/lib/colors';

interface TooltipProps {
  x: number;
  y: number;
  countyName: string;
  stateName: string;
  record: CountyRecord | null;
  metric: MetricConfig;
}

export default function Tooltip({ x, y, countyName, stateName, record, metric }: TooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[180px] rounded-lg border border-white/20 bg-black/85 px-3 py-2 font-sans text-[13px] text-white shadow-xl backdrop-blur-sm"
      style={{ left: x + 14, top: y - 14 }}
    >
      <div className="mb-1 font-semibold">
        {countyName}{stateName ? `, ${stateName}` : ''}
      </div>
      {record ? (
        <div className="space-y-0.5 text-[12px] text-white/80">
          <div className="flex justify-between gap-4">
            <span>{metric.label}:</span>
            <span className="font-medium text-white">{metric.format((record as any)[metric.key])}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Population:</span>
            <span>{record.population.toFixed(1)}K</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Total HH:</span>
            <span>{record.hh_total.toFixed(1)}K</span>
          </div>
        </div>
      ) : (
        <div className="text-[12px] text-white/50">No data</div>
      )}
    </div>
  );
}
