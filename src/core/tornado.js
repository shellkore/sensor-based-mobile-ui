export function readRotation(rate, time, previous = null) {
  if (!rate || ![rate.alpha, rate.beta, rate.gamma].some(Number.isFinite) || !Number.isFinite(time)) return null;
  const speed = Math.hypot(...[rate.alpha, rate.beta, rate.gamma].map(value => Number.isFinite(value) ? value : 0));
  const remaining = previous ? previous.intensity * Math.exp(-Math.max(0, time - previous.time) / 700) : 0;
  return { intensity: Math.max(remaining, Math.min(1, Math.max(0, (speed - 30) / 150))), time };
}

export function tornadoMotion(state, time, x, y) {
  const intensity = state ? state.intensity * Math.exp(-Math.max(0, time - state.time) / 700) : 0;
  const phase = time / 400;
  const cos = Math.cos(phase);
  const sin = Math.sin(phase);
  return { x: ((x + 40) * cos - y * sin - x) * intensity, y: ((x + 40) * sin + y * cos - y) * intensity };
}
