export function gravityMotion(beta, gamma, angle = 0) {
  if (!Number.isFinite(beta) || !Number.isFinite(gamma)) return null;
  const radians = Math.PI / 180;
  const x = Math.sin(gamma * radians) * Math.cos(beta * radians);
  const y = Math.sin(beta * radians);
  const rotation = (Number.isFinite(angle) ? angle : 0) * radians;
  return { x: 24 * (x * Math.cos(rotation) - y * Math.sin(rotation)), y: 24 * (x * Math.sin(rotation) + y * Math.cos(rotation)) };
}
