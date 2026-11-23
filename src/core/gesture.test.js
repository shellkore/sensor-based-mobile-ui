import test from 'node:test';
import assert from 'node:assert/strict';
import { readPinch, dragOffset } from './gesture.js';

test('pinch uses hand size, mirrors the cursor and waits for a wider release', () => {
  const hand = [];
  hand[5] = { x: 0.2, y: 0.4 };
  hand[17] = { x: 0.4, y: 0.4 };
  hand[4] = { x: 0.25, y: 0.5 };
  hand[8] = { x: 0.25, y: 0.56 };
  assert.deepEqual(readPinch(hand, 2, false), { x: 0.75, y: 0.53, closed: true });
  hand[8].y = 0.65;
  assert.equal(readPinch(hand, 2, false).closed, false);
  assert.equal(readPinch(hand, 2, true).closed, true);
  hand[8].y = 0.8;
  assert.equal(readPinch(hand, 2, true).closed, false);
  assert.equal(readPinch(null, 2, true), null);
});

test('regrabbing continues from the dropped position and respects both edges', () => {
  assert.equal(dragOffset(20, 15, 30, 60), 35);
  assert.equal(dragOffset(20, -100, 30, 60), -10);
  assert.equal(dragOffset(20, 100, 30, 60), 80);
});
