import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createScaredState, readLight, scaredMotion } from './scared.js';

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
