import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readLoudness } from './pulse.js';

test('loud sounds strengthen the pulse and silence lets it settle', () => {
  assert.equal(readLoudness(new Float32Array(8)), 0);
  const quiet = readLoudness(new Float32Array(8).fill(0.04));
  const loud = readLoudness(new Float32Array(8).fill(0.5));
  assert.ok(loud > quiet && loud <= 1);
  const settling = readLoudness(new Float32Array(8), loud);
  assert.ok(settling > 0 && settling < loud);
  assert.equal(readLoudness(new Float32Array()), 0);
});
