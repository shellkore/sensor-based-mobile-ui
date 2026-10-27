import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createMagneticState, readMagneticField, readMagneticHeading, magneticMotion } from './magnetic.js';

test('compass heading moves toward north in all four directions', () => {
  for (const [heading, x, y] of [[0, 0, -48], [90, -48, 0], [180, 0, 48], [270, 48, 0], [359.999, 0, -48]]) {
    const motion = magneticMotion(readMagneticHeading(createMagneticState(), heading));
    assert.ok(Math.abs(motion.x - x) < 0.01);
    assert.ok(Math.abs(motion.y - y) < 0.01);
  }
});

test('field readings point north and invalid readings leave the last direction unchanged', () => {
  const initial = createMagneticState();
  assert.deepEqual(magneticMotion(initial), { x: 0, y: 0 });
  const north = readMagneticField(initial, 0, 20);
  assert.deepEqual(magneticMotion(north), { x: 0, y: -48 });
  assert.deepEqual(magneticMotion(readMagneticField(north, -10, 0)), { x: -48, y: 0 });
  assert.equal(readMagneticField(north, 0, 0), north);
  assert.equal(readMagneticField(north, NaN, 1), north);
  assert.equal(readMagneticHeading(north, -1), north);
  assert.equal(readMagneticHeading(north, null), north);
});
