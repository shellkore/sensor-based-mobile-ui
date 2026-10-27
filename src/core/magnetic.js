export function createMagneticState() {
  return { baseline: null, field: null };
}

export function readMagneticField(state, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return state;
  const field = { x, y };
  // shortcut: the first reading is the baseline; use sampled calibration if hardware readings are noisy.
  return { baseline: state.baseline ?? field, field };
}

export function readMagneticHeading(state, heading) {
  if (!Number.isFinite(heading) || heading < 0 || heading >= 360) return state;
  const radians = heading * Math.PI / 180;
  // shortcut: compass heading has no field strength; use raw magnetometer readings when available.
  return readMagneticField(state, 30 * Math.cos(radians), 30 * Math.sin(radians));
}

export function magneticMotion(state) {
  if (!state.baseline) return { x: 0, y: 0 };
  const x = (state.field.x - state.baseline.x) * 0.8;
  const y = (state.field.y - state.baseline.y) * 0.8;
  const scale = Math.min(1, 24 / (Math.hypot(x, y) || 1));
  return { x: x * scale, y: y ? -y * scale : 0 };
}
