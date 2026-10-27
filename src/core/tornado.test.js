import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readRotation, tornadoMotion } from './tornado.js';

test('rotation drives bounded motion that settles after readings stop', () => {
  assert.equal(readRotation(null, 0), null);
  assert.equal(readRotation({ alpha: null, beta: null, gamma: null }, 0), null);
  const slow = readRotation({ alpha: 10 }, 1000);
  const fast = readRotation({ alpha: 500 }, 1000);
  assert.equal(slow.intensity, 0);
  assert.equal(fast.intensity, 1);
  const settling = readRotation({ alpha: 0 }, 1700, fast);
  assert.ok(settling.intensity > 0 && settling.intensity < 1);
  assert.ok(Math.hypot(...Object.values(tornadoMotion(fast, 1000, 0)).slice(0, 2)) > 20);
  assert.ok(Math.abs(tornadoMotion(fast, 10000, 0).x) < 0.001);
  assert.notDeepEqual(tornadoMotion(fast, 1000, 0), tornadoMotion(fast, 1000, 1));
});
