export function createScaredState() {
  return { baseline: null, light: null, time: null, impulse: 0 };
}

export function frameBrightness(pixels) {
  let total = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    total += pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722;
  }
  return pixels.length ? total / (pixels.length / 4) : 0;
}

export function readLight(state, light, time) {
  if (!Number.isFinite(light) || light < 0 || !Number.isFinite(time)) return state;
  // shortcut: the first reading is the baseline; use sampled calibration if hardware readings are noisy.
  if (state.baseline === null) return { baseline: light, light, time, impulse: 0 };
  const elapsed = Math.max((time - state.time) / 1000, 0.05);
  const drop = Math.max(0, (state.light - light) / Math.max(state.baseline, 1));
  return { ...state, light, time, impulse: Math.max(state.impulse * Math.exp(-elapsed * 2), Math.min(drop / elapsed, 1)) };
}

export function scaredMotion(state, time, index) {
  if (state.baseline === null || state.baseline < 1) return { x: 0, y: 0, rotate: 0 };
  const elapsed = Math.max(0, (time - state.time) / 1000);
  const darkness = Math.max(0, Math.min(1, (state.baseline - state.light) / state.baseline));
  const impulse = state.impulse * Math.exp(-elapsed * 2);
  const shake = darkness * (14 + impulse * 8);
  const phase = time / 35 + index * 2.4;
  return {
    x: Math.sin(phase) * shake + Math.sin(index * 7) * impulse * darkness * 18,
    y: Math.cos(phase * 1.3) * shake + Math.cos(index * 5) * impulse * darkness * 18,
    rotate: Math.sin(phase * 0.8) * shake * 0.45 + Math.sin(index * 3) * impulse * darkness * 5
  };
}
