import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { gravityMotion } from './gravity.js';

test('tilt moves cards toward the lower screen edge, with bounded movement', () => {
  assert.equal(gravityMotion(null, 0), null);
  assert.deepEqual(gravityMotion(0, 0), { x: 0, y: 0 });
  assert.ok(gravityMotion(45, 0).y > 0);
  assert.ok(gravityMotion(-45, 0).y < 0);
  assert.ok(gravityMotion(0, 45).x > 0);
  assert.ok(gravityMotion(45, 0, 90).x < 0);
  assert.ok(Math.hypot(...Object.values(gravityMotion(60, 60))) <= 24.000001);
});
