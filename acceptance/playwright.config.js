import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '*.spec.js',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    // shortcut: bundled Chromium stalls on this Windows host; retry it when browser startup is fixed.
    channel: process.platform === 'win32' ? 'chrome' : 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: { command: 'npm start', url: 'http://127.0.0.1:4174' },
});
