export function createMagneticState() {
  return { field: null };
}

export function readMagneticField(state, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y) || Math.hypot(x, y) === 0) return state;
  return { field: { x, y } };
}

export function readMagneticHeading(state, heading) {
  if (!Number.isFinite(heading) || heading < 0 || heading >= 360) return state;
  const radians = heading * Math.PI / 180;
  return readMagneticField(state, -Math.sin(radians), Math.cos(radians));
}

export function magneticMotion(state) {
  if (!state.field) return { x: 0, y: 0 };
  const { x, y } = state.field;
  const scale = 48 / Math.hypot(x, y);
  return { x: x ? x * scale : 0, y: y ? -y * scale : 0 };
}
