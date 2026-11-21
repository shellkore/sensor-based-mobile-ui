import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { gravityMotion } from './gravity.js';
import { magneticMotion } from './magnetic.js';
import { readLoudness } from './pulse.js';
import { readEarthquake } from './earthquake.js';
import { readRotation } from './tornado.js';
import { scaredMotion } from './scared.js';

test('sensitivity preserves the original response by default', () => {
  const light = { baseline: 100, light: 75, time: 1000, impulse: 0.5 };
  const field = { field: { x: 1, y: 2 } };
  const samples = new Float32Array(8).fill(0.03);
  assert.deepEqual(gravityMotion(30, 20), gravityMotion(30, 20, 0, 1));
  assert.deepEqual(magneticMotion(field), magneticMotion(field, 1));
  assert.deepEqual(scaredMotion(light, 1100, 1), scaredMotion(light, 1100, 1, 1));
  assert.equal(readLoudness(samples), readLoudness(samples, 0, 1));
  assert.deepEqual(readEarthquake({ x: 5 }, 1000), readEarthquake({ x: 5 }, 1000, null, 1));
  assert.deepEqual(readRotation({ alpha: 90 }, 1000), readRotation({ alpha: 90 }, 1000, null, 1));
});

test('input sensitivity can activate signals below the usual motion and audio thresholds', () => {
  const samples = new Float32Array(8).fill(0.002);
  assert.equal(readLoudness(samples), 0);
  assert.ok(readLoudness(samples, 0, 2) > 0);
  assert.equal(readEarthquake({ x: 1 }, 0).intensity, 0);
  assert.ok(readEarthquake({ x: 1 }, 0, null, 2).intensity > 0);
  assert.equal(readRotation({ alpha: 20 }, 0).intensity, 0);
  assert.ok(readRotation({ alpha: 20 }, 0, null, 2).intensity > 0);
});

test('sensitivity preserves gravity bounds, compass direction, and light calibration', () => {
  const normal = gravityMotion(10, 0);
  assert.equal(gravityMotion(10, 0, 0, 2).y, normal.y * 2);
  assert.ok(Math.hypot(...Object.values(gravityMotion(60, 60, 90, 2))) <= 80.000001);
  const field = { field: { x: 3, y: 4 } };
  assert.ok(Math.abs(magneticMotion(field, 0.5).x - 14.4) < 1e-10);
  assert.equal(magneticMotion(field, 0.5).y, -19.2);
  const light = { baseline: 100, light: 75, time: 1000, impulse: 0 };
  assert.equal(scaredMotion(light, 1000, 0, 2).scaleY, 0.875);
  assert.deepEqual(scaredMotion(light, 1000, 0, 0), { x: 0, y: 0, rotate: 0, scaleY: 1 });
  assert.equal(light.baseline, 100);
});
