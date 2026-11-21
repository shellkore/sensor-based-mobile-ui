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
    navigator.mediaDevices.getUserMedia = async options => {
      window.sensorCalls.starts++;
      if (options.video) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 24;
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, 32, 24);
        window.cameraCanvas = canvas;
        const stream = canvas.captureStream(0);
        const videoTrack = stream.getVideoTracks()[0];
        const stop = videoTrack.stop.bind(videoTrack);
        videoTrack.stop = () => { window.sensorCalls.stops++; stop(); };
        window.cameraTrack = videoTrack;
        videoTrack.requestFrame();
        return stream;
      }
      return { getTracks: () => [track], getAudioTracks: () => [track] };
    };
    window.AudioContext = class {
      createMediaStreamSource() { return { connect() {} }; }
      createAnalyser() { return { fftSize: 1024, getFloatTimeDomainData(samples) { samples.fill(window.audioSample ?? 0.2); } }; }
      async resume() {}
      async close() {}
    };
  });
  await page.goto('/');
});

async function activate(page, name, { custom = false, weak = false } = {}) {
  await page.getByLabel('Component').selectOption(name);
  if (weak) await page.evaluate(() => { window.audioSample = 0.03; });
  await page.getByRole('button', { name: custom ? 'Custom enable' : new RegExp(`^Enable ${name}$`, 'i'), exact: true }).click();
  await sensorInput(page, name, weak);
  await expect(page.getByRole('status')).toContainText(custom ? 'active' : {
    ScaredUI: 'Cover the light sensor', CompassUI: 'magnetic north',
    TornadoUI: 'Rotate your device quickly', EarthquakeUI: 'Shake your phone',
    PulseUI: 'Microphone active', GravityUI: 'Tilt your phone',
  }[name]);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function sensorInput(page, name, weak = false) {
  await page.evaluate(({ name, weak }) => {
    if (name === 'ScaredUI') {
      window.lightSensor.illuminance = 100;
      window.lightSensor.dispatchEvent(new Event('reading'));
      window.lightSensor.illuminance = weak ? 75 : 0;
      window.lightSensor.dispatchEvent(new Event('reading'));
    } else if (name === 'CompassUI') {
      Object.assign(window.magnetometer, { x: 1, y: 1 });
      window.magnetometer.dispatchEvent(new Event('reading'));
    } else {
      const type = name === 'GravityUI' ? 'deviceorientation' : 'devicemotion';
      window.dispatchEvent(Object.assign(new Event(type), {
        beta: weak ? 10 : 30, gamma: weak ? 10 : 30,
        acceleration: weak ? { x: 2, y: 0, z: 0 } : { x: 15, y: 10, z: 5 },
        rotationRate: weak ? { alpha: 45, beta: 0, gamma: 0 } : { alpha: 180, beta: 90, gamma: 45 },
      }));
    }
  }, { name, weak });
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
  test(`${name}: custom controls and wrapper styles preserve activation and cleanup`, async ({ page }) => {
    await page.getByLabel('Custom controls').check();
    await page.getByLabel('Styled wrappers').check();
    await page.getByLabel('Component').selectOption(name);
    await expect(page.getByTestId('custom-controls')).toBeVisible();
    await expect(page.getByRole('button', { name: new RegExp(`^Enable ${name}$`, 'i') })).toHaveCount(0);
    const wrapper = page.getByTestId('card').locator('..');
    await expect(wrapper).toHaveClass('consumer-item');
    await expect(wrapper).toHaveCSS('display', 'block');
    await expect(wrapper).toHaveCSS('padding', '12px');
    await expect(wrapper).toHaveCSS('border-radius', '16px');
    await activate(page, name, { custom: true });
    await expect.poll(async () => Math.max(...(await effect(page)).map(Math.abs))).toBeGreaterThan(0.05);
    await page.getByLabel('Styled wrappers').uncheck();
    await expect(wrapper).not.toHaveClass('consumer-item');
    await expect(wrapper).toHaveCSS('display', 'inline-block');
    await page.getByRole('button', { name: 'Custom stop', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(['ScaredUI', 'PulseUI'].includes(name) ? 'stopped' : 'idle');
    await expect.poll(() => wrapper.evaluate(element => element.style.transform)).toBe('');
    if (['ScaredUI', 'CompassUI', 'PulseUI'].includes(name)) {
      expect(await page.evaluate(() => window.sensorCalls.stops)).toBeGreaterThan(0);
    }
    await activate(page, name, { custom: true });
  });

  test(`${name}: sensitivity responds to weak inputs, changes live, and validates values`, async ({ page }) => {
    await page.getByLabel('Custom controls').check();
    await activate(page, name, { custom: true, weak: true });
    if (name === 'PulseUI') await expect.poll(async () => (await effect(page))[3]).toBeCloseTo(0.0216, 5);
    if (name === 'GravityUI') await expect.poll(async () => (await effect(page))[1]).toBeCloseTo(80 * Math.sin(Math.PI / 18), 3);
    const baseline = await effect(page);
    const magnitude = values => Math.max(...values.map(Math.abs));
    expect(magnitude(baseline)).toBeGreaterThan(0.001);
    const calls = await page.evaluate(() => window.sensorCalls);
    await page.getByLabel('Sensitivity').selectOption('double');
    await sensorInput(page, name, true);
    await expect.poll(async () => magnitude(await effect(page))).toBeGreaterThan(magnitude(baseline) * 1.5);
    await page.getByLabel('Sensitivity').selectOption('zero');
    await sensorInput(page, name, true);
    await expectFactor(page, baseline, 0);
    expect(await page.evaluate(() => window.sensorCalls)).toEqual(calls);
    for (const value of ['invalid', 'infinite', 'string', 'normal', 'half', 'negative', 'excessive']) {
      await page.getByRole('button', { name: 'Custom stop', exact: true }).click();
      await page.getByLabel('Sensitivity').selectOption(value);
      await activate(page, name, { custom: true, weak: true });
      if (value === 'negative') await expectFactor(page, baseline, 0);
      else if (value === 'half') await expect.poll(async () => magnitude(await effect(page))).toBeLessThan(magnitude(baseline) * 0.75);
      else if (value === 'excessive') await expect.poll(async () => magnitude(await effect(page))).toBeGreaterThan(magnitude(baseline) * 1.5);
      else await expectFactor(page, baseline, 1);
    }
  });

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

test('custom controls keep permission denial and retry observable', async ({ page }) => {
  await page.getByLabel('Custom controls').check();
  await page.evaluate(() => { window.permission = 'denied'; });
  await page.getByRole('button', { name: 'Custom enable', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('denied');
  await page.evaluate(() => { window.permission = 'granted'; });
  await activate(page, 'GravityUI', { custom: true });
});

test('stopping a custom control cancels a pending orientation permission request', async ({ page }) => {
  await page.getByLabel('Custom controls').check();
  await page.evaluate(() => {
    window.DeviceOrientationEvent.requestPermission = () => new Promise(resolve => { window.resolvePermission = resolve; });
  });
  await page.getByRole('button', { name: 'Custom enable', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('permission');
  await expect(page.getByRole('button', { name: 'Custom enable', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Custom stop', exact: true }).click();
  await page.evaluate(() => window.resolvePermission('granted'));
  await sensorInput(page, 'GravityUI');
  await expect(page.getByRole('status')).toHaveText('idle');
  expect(await effect(page)).toEqual([0, 0, 0, 0, 0]);
});

test('missing orientation API gives a useful unsupported message', async ({ page }) => {
  await page.evaluate(() => { delete window.DeviceOrientationEvent; });
  await page.getByRole('button', { name: 'Enable gravityUI', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('does not provide device orientation');
});

test('ScaredUI preserves custom control placement, animation, and light recalibration', async ({ page }) => {
  await page.getByLabel('Custom controls').check();
  await page.getByLabel('Animate scared controls').check();
  await activate(page, 'ScaredUI', { custom: true });
  const controls = page.locator('.scared-controls');
  await expect(controls).toContainText('Custom enable');
  expect(await controls.evaluate(element => element.previousElementSibling.contains(document.querySelector('[data-testid="card"]')))).toBe(true);
  await expect.poll(() => controls.evaluate(element => element.style.transform)).toContain('translate(');
  await page.getByRole('button', { name: 'Custom recalibrate', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('starting');
  await sensorInput(page, 'ScaredUI');
  await expect(page.getByRole('status')).toHaveText('active');
});

test('custom camera controls keep calibration, sensitivity, and track cleanup working', async ({ page }) => {
  await page.getByLabel('Component').selectOption('ScaredUI');
  await page.getByLabel('Custom controls').check();
  await page.getByRole('button', { name: 'Custom camera', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('camera-active');
  await page.locator('video').evaluate(video => new Promise(resolve => {
    video.requestVideoFrameCallback(resolve);
    const context = window.cameraCanvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, 32, 24);
    window.cameraTrack.requestFrame();
  }));
  await page.clock.setFixedTime(new Date('2026-11-16T12:00:00.200Z'));
  await expect.poll(async () => (await effect(page))[4]).toBeCloseTo(-0.25, 3);
  await page.getByLabel('Sensitivity').selectOption('half');
  await expect.poll(async () => (await effect(page))[4]).toBeCloseTo(-0.125, 3);
  await page.getByRole('button', { name: 'Custom recalibrate', exact: true }).click();
  await page.clock.setFixedTime(new Date('2026-11-16T12:00:00.400Z'));
  await expect(page.getByRole('status')).toHaveText('camera-dark');
  await expectFactor(page, [0, 0, 0, 0, 0], 0);
  await page.getByRole('button', { name: 'Custom stop camera', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('stopped');
  expect(await page.evaluate(() => window.cameraTrack.readyState)).toBe('ended');
});

test('custom microphone stop releases a stream granted after cancellation', async ({ page }) => {
  await page.getByLabel('Component').selectOption('PulseUI');
  await page.getByLabel('Custom controls').check();
  await page.evaluate(() => {
    const original = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = options => new Promise(resolve => {
      window.resolveMicrophone = async () => resolve(await original(options));
    });
  });
  await page.getByRole('button', { name: 'Custom enable', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('pending');
  await page.getByRole('button', { name: 'Custom stop', exact: true }).click();
  await page.evaluate(() => window.resolveMicrophone());
  await expect(page.getByRole('status')).toHaveText('stopped');
  await expect.poll(() => page.evaluate(() => window.sensorCalls.stops)).toBeGreaterThan(0);
});
