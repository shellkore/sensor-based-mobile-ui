import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readEarthquake, earthquakeMotion } from './earthquake.js';

test('acceleration controls impact and displaced elements slowly return', () => {
  assert.equal(readEarthquake(null, 0), null);
  assert.equal(readEarthquake({ x: null }, 0), null);
  const still = readEarthquake({ x: 0 }, 0);
  const gentle = readEarthquake({ x: 5 }, 0, still);
  const hard = readEarthquake({ x: 30 }, 0, gentle);
  assert.equal(still.intensity, 0);
  assert.ok(gentle.intensity > 0 && gentle.intensity < hard.intensity);
  assert.equal(hard.intensity, 1);
  assert.equal(readEarthquake({ x: 0 }, 1000, hard), hard);
  assert.ok(Math.abs(earthquakeMotion(hard, 5000, 0).x) < Math.abs(earthquakeMotion(hard, 2000, 0).x));
  assert.deepEqual(earthquakeMotion(hard, 8000, 0), { x: 0, y: -0, rotate: 0 });
});
