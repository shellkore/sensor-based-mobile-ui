import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] } });

// Wait for inference to consume each pose before checking the rendered cards.
async function pose(page, x, closed) {
  await page.evaluate(({ x, closed }) => {
    const gap = closed ? 0.005 : 0.08;
    const hand = [];
    hand[4] = { x: 1 - x - gap, y: 0.5 };
    hand[8] = { x: 1 - x + gap, y: 0.5 };
    hand[5] = { x: 0.2, y: 0.4 };
    hand[17] = { x: 0.4, y: 0.4 };
    window.hands = x === null ? [] : [hand];
    window.poseRead = false;
  }, { x, closed });
  await page.waitForFunction(() => window.poseRead);
}

for (const release of ['open fingers', 'tracking loss']) {
  test(`GestureUI grabs on pinch, drags sideways, and drops on ${release}`, async ({ page }) => {
    await page.route('**/vision_bundle.mjs', route => route.fulfill({
      contentType: 'application/javascript',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: `
        export const FilesetResolver = { async forVisionTasks() { return {}; } };
        export const HandLandmarker = { async createFromOptions() {
          return {
            detectForVideo() { window.poseRead = true; return { landmarks: window.hands ?? [] }; },
            close() {}
          };
        } };
      `,
    }));
    await page.goto('/');
    await page.getByLabel('Component').selectOption('GestureUI');
    await page.getByRole('button', { name: 'Enable hand tracking' }).click();
    const first = page.getByRole('button', { name: 'First card' });
    const second = page.getByRole('button', { name: 'Second card' });
    const initial = await first.boundingBox();
    const neighbor = await second.boundingBox();
    const board = await first.locator('../..').boundingBox();
    const aim = (initial.x + initial.width / 2 - board.x) / board.width;
    const status = page.getByRole('status');

    await pose(page, aim, false);
    await expect(status).toContainText('Aim at a card');
    await pose(page, aim, true);
    await expect(status).toContainText('Card grabbed');
    await pose(page, aim + 0.25, true);
    const dropped = await first.boundingBox();
    expect(dropped.x).toBeCloseTo(initial.x + board.width * 0.25, 0);
    expect(dropped.y).toBe(initial.y);
    expect(await second.boundingBox()).toEqual(neighbor);

    await pose(page, release === 'tracking loss' ? null : aim + 0.25, false);
    await expect(status).toContainText(release === 'tracking loss' ? 'Show an open hand' : 'Aim at a card');
    await pose(page, aim + 0.45, false);
    expect(await first.boundingBox()).toEqual(dropped);
  });
}
