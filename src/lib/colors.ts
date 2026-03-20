/** Interpolate between two RGB colors */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type RGB = [number, number, number];

const SEQUENTIAL_RAMP: RGB[] = [
  [255, 255, 229],  // lightest yellow
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132],    // darkest blue
];

/** Map a normalized value 0–1 to a color on the YlGnBu ramp */
export function sequentialColor(t: number): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (SEQUENTIAL_RAMP.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, SEQUENTIAL_RAMP.length - 1);
  const frac = idx - lo;
  return [
    lerp(SEQUENTIAL_RAMP[lo][0], SEQUENTIAL_RAMP[hi][0], frac),
    lerp(SEQUENTIAL_RAMP[lo][1], SEQUENTIAL_RAMP[hi][1], frac),
    lerp(SEQUENTIAL_RAMP[lo][2], SEQUENTIAL_RAMP[hi][2], frac),
    200,
  ];
}

export const NO_DATA_COLOR: [number, number, number, number] = [200, 200, 200, 120];

export interface MetricConfig {
  key: string;
  label: string;
  format: (v: number) => string;
}

export const METRICS: MetricConfig[] = [
  { key: 'hh_total',          label: 'Total Households',     format: v => `${v.toFixed(1)}K` },
  { key: 'population',        label: 'Population',           format: v => `${v.toFixed(1)}K` },
  { key: 'totalEmployment',   label: 'Total Employment',     format: v => `${v.toFixed(1)}K` },
  { key: 'lodgingEmployment', label: 'Lodging Employment',   format: v => `${v.toFixed(3)}K` },
  { key: 'retailTrade',       label: 'Retail Trade',         format: v => `${v.toFixed(2)}K` },
  { key: 'hh_<25K',           label: 'Households < $25K',    format: v => `${v.toFixed(1)}K` },
  { key: 'hh_25K-40K',        label: 'Households $25-40K',   format: v => `${v.toFixed(1)}K` },
  { key: 'hh_40K-60K',        label: 'Households $40-60K',   format: v => `${v.toFixed(1)}K` },
  { key: 'hh_60K-100K',       label: 'Households $60-100K',  format: v => `${v.toFixed(1)}K` },
  { key: 'hh_>100K',          label: 'Households > $100K',   format: v => `${v.toFixed(1)}K` },
];
