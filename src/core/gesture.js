// Normalize finger separation by palm width so moving closer to the camera
// does not turn an open hand into a pinch. Use pixels for non-square video.
export function readPinch(hand, aspect, pinched) {
  if (!hand) return null;
  const distance = (a, b) => Math.hypot((a.x - b.x) * aspect, a.y - b.y);
  const width = distance(hand[5], hand[17]);
  if (!width) return null;
  const thumb = hand[4], finger = hand[8];
  return {
    x: 1 - (thumb.x + finger.x) / 2,
    y: (thumb.y + finger.y) / 2,
    closed: distance(thumb, finger) / width < (pinched ? 0.5 : 0.3)
  };
}

export function dragOffset(start, movement, leftRoom, rightRoom) {
  return start + Math.max(-leftRoom, Math.min(rightRoom, movement));
}
