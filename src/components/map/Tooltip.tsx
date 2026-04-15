interface TooltipProps {
  x: number;
  y: number;
  title: string;
  lines: string[];
}

export default function Tooltip({ x, y, title, lines }: TooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[180px] rounded-lg border border-white/20 bg-black/85 px-3 py-2 font-sans text-[13px] text-white shadow-xl backdrop-blur-sm"
      style={{ left: x + 14, top: y - 14 }}
    >
      <div className="mb-1 font-semibold">{title}</div>
      <div className="space-y-0.5 text-[12px] text-white/80">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
