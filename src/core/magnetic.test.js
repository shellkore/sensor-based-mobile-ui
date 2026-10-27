import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createMagneticState, readMagneticField, readMagneticHeading, magneticMotion } from './magnetic.js';

test('calibrates, follows field changes, limits movement, and ignores invalid readings', () => {
  const initial = readMagneticField(createMagneticState(), 10, 20);
  assert.deepEqual(magneticMotion(initial), { x: 0, y: 0 });
  const changed = readMagneticField(initial, 20, 25);
  assert.deepEqual(magneticMotion(changed), { x: 8, y: -4 });
  const limited = magneticMotion(readMagneticField(initial, 1010, 1020));
  assert.ok(Math.abs(Math.hypot(limited.x, limited.y) - 24) < 1e-10);
  assert.equal(readMagneticField(changed, NaN, 1), changed);
  assert.deepEqual(magneticMotion(readMagneticField(createMagneticState(), 20, 25)), { x: 0, y: 0 });
});

test('compass headings calibrate, wrap around north, and reject invalid readings', () => {
  const initial = readMagneticHeading(createMagneticState(), 359);
  assert.deepEqual(magneticMotion(initial), { x: 0, y: 0 });
  assert.ok(Math.hypot(...Object.values(magneticMotion(readMagneticHeading(initial, 1)))) < 1);
  assert.ok(Math.hypot(...Object.values(magneticMotion(readMagneticHeading(initial, 90)))) > 10);
  assert.equal(readMagneticHeading(initial, -1), initial);
  assert.equal(readMagneticHeading(initial, null), initial);
});
