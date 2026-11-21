export function gravityMotion(beta, gamma, angle = 0, sensitivity = 1) {
  if (!Number.isFinite(beta) || !Number.isFinite(gamma)) return null;
  const radians = Math.PI / 180;
  const x = Math.sin(gamma * radians) * Math.cos(beta * radians);
  const y = Math.sin(beta * radians);
  const gain = Math.min(sensitivity, 1 / Math.hypot(x, y));
  const rotation = (Number.isFinite(angle) ? angle : 0) * radians;
  return { x: 80 * gain * (x * Math.cos(rotation) - y * Math.sin(rotation)), y: 80 * gain * (x * Math.sin(rotation) + y * Math.cos(rotation)) };
}
