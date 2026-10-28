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
  assert.notDeepEqual(scaredMotion(fast, 1100, 1), { x: 0, y: 0, rotate: 0, scaleY: 1 });
  assert.deepEqual(scaredMotion(readLight(fast, 100, 1200), 1200, 1), { x: 0, y: 0, rotate: 0, scaleY: 1 });
  assert.equal(readLight(initial, NaN, 1200), initial);
  assert.deepEqual(scaredMotion(readLight(createScaredState(), 0, 1000), 1000, 1), { x: 0, y: 0, rotate: 0, scaleY: 1 });
});

test('keeps shaking while covered and reacts more to a darker view', () => {
  const baseline = readLight(createScaredState(), 100, 1000);
  const partlyCovered = readLight(readLight(baseline, 60, 1100), 60, 12000);
  const mostlyCovered = readLight(readLight(baseline, 10, 1100), 10, 12000);
  const partialMotion = scaredMotion(partlyCovered, 12100, 1);
  const closeMotion = scaredMotion(mostlyCovered, 12100, 1);
  const amplitude = motion => Math.hypot(motion.x, motion.y);
  assert.ok(amplitude(partialMotion) > 3);
  assert.ok(amplitude(closeMotion) > amplitude(partialMotion) * 2);
  assert.ok(closeMotion.scaleY < partialMotion.scaleY);
  assert.ok(closeMotion.scaleY >= 0.75);
  assert.notDeepEqual(scaredMotion(mostlyCovered, 12100, 1), scaredMotion(mostlyCovered, 12140, 1));
  assert.deepEqual(scaredMotion(readLight(mostlyCovered, 100, 12200), 12200, 1), { x: 0, y: 0, rotate: 0, scaleY: 1 });
});
