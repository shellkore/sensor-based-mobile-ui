export function readLoudness(samples, previous = 0) {
  if (!samples.length) return 0;
  const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
  const target = Math.min(1, Math.max(0, (rms - 0.003) * 10));
  return previous + (target - previous) * (target > previous ? 0.45 : 0.08);
}
