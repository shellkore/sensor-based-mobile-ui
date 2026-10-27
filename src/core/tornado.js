export function readRotation(rate, time, previous = null) {
  if (!rate || ![rate.alpha, rate.beta, rate.gamma].some(Number.isFinite) || !Number.isFinite(time)) return null;
  const speed = Math.hypot(...[rate.alpha, rate.beta, rate.gamma].map(value => Number.isFinite(value) ? value : 0));
  const remaining = previous ? previous.intensity * Math.exp(-Math.max(0, time - previous.time) / 700) : 0;
  return { intensity: Math.max(remaining, Math.min(1, Math.max(0, (speed - 30) / 150))), time };
}

export function tornadoMotion(state, time, index) {
  const intensity = state ? state.intensity * Math.exp(-Math.max(0, time - state.time) / 700) : 0;
  const phase = time / 180 + index * 2.4;
  return { x: Math.cos(phase) * 35 * intensity, y: Math.sin(phase) * 22 * intensity, rotate: Math.sin(phase) * 20 * intensity };
}
