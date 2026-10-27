export function readEarthquake(acceleration, time, previous = null) {
  if (!acceleration || ![acceleration.x, acceleration.y, acceleration.z].some(Number.isFinite) || !Number.isFinite(time)) return null;
  const strength = Math.hypot(...[acceleration.x, acceleration.y, acceleration.z].map(value => Number.isFinite(value) ? value : 0));
  const intensity = Math.min(1, Math.max(0, (strength - 1.5) / 13));
  if (!intensity) return previous || { intensity: 0, time };
  return { intensity, time };
}

export function earthquakeMotion(state, time, index) {
  if (!state) return { x: 0, y: 0, rotate: 0 };
  const elapsed = Math.max(0, time - state.time);
  const returnScale = Math.max(0, 1 - Math.max(0, elapsed - 2000) / 6000);
  const shake = Math.max(0, 1 - elapsed / 2000);
  const direction = index % 2 ? -1 : 1;
  const intensity = state.intensity * returnScale;
  return {
    x: intensity * direction * (65 + 35 * shake * Math.sin(time / 45 + index)),
    y: intensity * (index % 3 - 1) * (40 + 25 * shake * Math.cos(time / 55 + index)),
    rotate: intensity * direction * (12 + 8 * shake * Math.sin(time / 60 + index))
  };
}
