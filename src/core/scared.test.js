import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createScaredState, frameBrightness, readLight, scaredMotion } from './scared.js';

test('camera brightness drops when its view is covered', () => {
  const bright = frameBrightness(new Uint8ClampedArray([200, 200, 200, 255, 100, 100, 100, 255]));
  const dark = frameBrightness(new Uint8ClampedArray([20, 20, 20, 255, 10, 10, 10, 255]));
  assert.ok(Math.abs(bright - 150) < 0.001);
  assert.ok(dark < bright);
  assert.ok(readLight(readLight(createScaredState(), bright, 1000), dark, 1100).impulse > 0);
  assert.equal(frameBrightness([]), 0);
});

test('calibrates, responds more to a fast shadow, and settles after light returns', () => {
  const initial = readLight(createScaredState(), 100, 1000);
  const fast = readLight(initial, 50, 1100);
  const slow = readLight(initial, 50, 2000);
  assert.ok(fast.impulse > slow.impulse);
  assert.notDeepEqual(scaredMotion(fast, 1100, 1), { x: 0, y: 0, rotate: 0 });
  assert.deepEqual(scaredMotion(readLight(fast, 100, 1200), 1200, 1), { x: 0, y: 0, rotate: 0 });
  assert.equal(readLight(initial, NaN, 1200), initial);
  assert.deepEqual(scaredMotion(readLight(createScaredState(), 0, 1000), 1000, 1), { x: 0, y: 0, rotate: 0 });
});
