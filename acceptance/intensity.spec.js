import { test, expect } from '@playwright/test';

const components = ['ScaredUI', 'CompassUI', 'TornadoUI', 'EarthquakeUI', 'PulseUI', 'GravityUI'];

test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => expect.soft(error.message, 'Uncaught browser error').toBeUndefined());
  await page.clock.setFixedTime(new Date('2026-11-16T12:00:00Z'));
  await page.addInitScript(() => {
    window.sensorCalls = { permissions: 0, starts: 0, stops: 0 };
    window.permission = 'granted';
    window.DeviceMotionEvent.requestPermission = window.DeviceOrientationEvent.requestPermission = async () => {
      window.sensorCalls.permissions++;
      return window.permission;
    };
    class Sensor extends EventTarget {
      start() { window.sensorCalls.starts++; }
      stop() { window.sensorCalls.stops++; }
    }
    window.AmbientLightSensor = class extends Sensor {
      constructor() { super(); window.lightSensor = this; }
    };
    window.Magnetometer = class extends Sensor {
      constructor() { super(); window.magnetometer = this; }
    };
    const track = new EventTarget();
    track.stop = () => { window.sensorCalls.stops++; };
    navigator.mediaDevices.getUserMedia = async () => {
      window.sensorCalls.starts++;
      return { getTracks: () => [track], getAudioTracks: () => [track] };
    };
    window.AudioContext = class {
      createMediaStreamSource() { return { connect() {} }; }
      createAnalyser() { return { fftSize: 1024, getFloatTimeDomainData(samples) { samples.fill(0.2); } }; }
      async resume() {}
      async close() {}
    };
  });
  await page.goto('/');
});

async function activate(page, name) {
  await page.getByLabel('Component').selectOption(name);
  await page.getByRole('button', { name: new RegExp(`^Enable ${name}$`, 'i') }).click();
  await page.evaluate(name => {
    if (name === 'ScaredUI') {
      window.lightSensor.illuminance = 100;
      window.lightSensor.dispatchEvent(new Event('reading'));
      window.lightSensor.illuminance = 0;
      window.lightSensor.dispatchEvent(new Event('reading'));
    } else if (name === 'CompassUI') {
      Object.assign(window.magnetometer, { x: 1, y: 1 });
      window.magnetometer.dispatchEvent(new Event('reading'));
    } else {
      const type = name === 'GravityUI' ? 'deviceorientation' : 'devicemotion';
      window.dispatchEvent(Object.assign(new Event(type), {
        beta: 30, gamma: 30,
        acceleration: { x: 15, y: 10, z: 5 },
        rotationRate: { alpha: 180, beta: 90, gamma: 45 },
      }));
    }
  }, name);
  await expect(page.getByRole('status')).toContainText({
    ScaredUI: 'Cover the light sensor', CompassUI: 'magnetic north',
    TornadoUI: 'Rotate your device quickly', EarthquakeUI: 'Shake your phone',
    PulseUI: 'Microphone active', GravityUI: 'Tilt your phone',
  }[name]);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function effect(page) {
  return page.getByTestId('card').evaluate(card => {
    const matrix = new DOMMatrix(getComputedStyle(card.parentElement).transform);
    const scaleX = Math.hypot(matrix.a, matrix.b);
    const scaleY = (matrix.a * matrix.d - matrix.b * matrix.c) / scaleX;
    return [matrix.e, matrix.f, Math.atan2(matrix.b, matrix.a), scaleX - 1, scaleY - 1];
  });
}

async function expectFactor(page, baseline, factor) {
  await expect.poll(async () => {
    const actual = await effect(page);
    return Math.max(...actual.map((value, index) => Math.abs(value - baseline[index] * factor)));
  }).toBeLessThan(0.002);
}

for (const name of components) {
  test(`${name}: intensity scales the rendered effect and updates without restarting`, async ({ page }) => {
    await activate(page, name);
    await expect.poll(async () => Math.max(...(await effect(page)).map(Math.abs))).toBeGreaterThan(0.05);
    // Let the microphone envelope and CSS transition reach their stable values.
    if (name === 'PulseUI') await expect.poll(async () => (await effect(page))[3]).toBeGreaterThan(0.07999);
    if (name === 'GravityUI') await expect.poll(async () => (await effect(page))[1]).toBeCloseTo(40, 3);
    const baseline = await effect(page);
    const calls = await page.evaluate(() => window.sensorCalls);
    for (const [value, factor] of [['half', 0.5], ['double', 2], ['zero', 0], ['negative', 0], ['excessive', 2], ['invalid', 1], ['infinite', 1], ['string', 1], ['normal', 1]]) {
      await page.getByLabel('Intensity').selectOption(value);
      if (name === 'GravityUI') {
        await page.evaluate(() => window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta: 30, gamma: 30 })));
      }
      await expectFactor(page, baseline, factor);
      if (name === 'PulseUI' && factor === 0) {
        await expect.poll(() => page.getByTestId('card').evaluate(card => getComputedStyle(card.parentElement).boxShadow)).toBe('rgba(182, 245, 91, 0) 0px 0px 0px 0px');
      }
    }
    expect(await page.evaluate(() => window.sensorCalls)).toEqual(calls);
  });

  test(`${name}: reduced motion suppresses movement even at double intensity`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByLabel('Intensity').selectOption('double');
    await activate(page, name);
    await expectFactor(page, [0, 0, 0, 0, 0], 0);
    if (['ScaredUI', 'CompassUI', 'PulseUI'].includes(name)) {
      await page.getByRole('button', { name: 'Unmount', exact: true }).click();
      await expect.poll(() => page.evaluate(() => window.sensorCalls.stops)).toBeGreaterThan(0);
    }
  });
}

test('permission denial is visible and a retry can recover', async ({ page }) => {
  await page.evaluate(() => { window.permission = 'denied'; });
  await page.getByRole('button', { name: 'Enable gravityUI', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('denied');
  await page.evaluate(() => { window.permission = 'granted'; });
  await activate(page, 'GravityUI');
  await expect(page.getByRole('status')).toContainText('Tilt your phone');
});

test('missing orientation API gives a useful unsupported message', async ({ page }) => {
  await page.evaluate(() => { delete window.DeviceOrientationEvent; });
  await page.getByRole('button', { name: 'Enable gravityUI', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('does not provide device orientation');
});
