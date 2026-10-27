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
  assert.ok(Math.abs(tornadoMotion(fast, 10000, 100, 0).x) < 0.001);
});

test('components orbit a shared center in a circle', () => {
  const state = { intensity: 1, time: 0 };
  const atStart = tornadoMotion(state, 0, 100, 0);
  const quarter = tornadoMotion({ ...state, time: Math.PI * 200 }, Math.PI * 200, 100, 0);
  assert.ok(Math.abs(atStart.x - 40) < 0.001 && Math.abs(atStart.y) < 0.001);
  assert.ok(Math.abs(quarter.x + 100) < 0.001 && Math.abs(quarter.y - 140) < 0.001);
  const other = tornadoMotion({ ...state, time: Math.PI * 200 }, Math.PI * 200, -100, 0);
  assert.ok(Math.abs(other.x - 100) < 0.001 && Math.abs(other.y + 60) < 0.001);
});
