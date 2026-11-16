import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { normalizeIntensity } from './intensity.js';

test('intensity defaults safely and stays within the supported range', () => {
  assert.equal(normalizeIntensity(undefined), 1);
  assert.equal(normalizeIntensity(NaN), 1);
  assert.equal(normalizeIntensity(-1), 0);
  assert.equal(normalizeIntensity(0.5), 0.5);
  assert.equal(normalizeIntensity(10), 2);
});
