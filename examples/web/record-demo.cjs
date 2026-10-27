const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH);

const root = path.resolve(__dirname, '../..');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
    await page.route('http://demo.local/**', route => {
      const files = { '/': 'examples/web/scared-demo.html', '/src/core/scared.js': 'src/core/scared.js' };
      const file = files[new URL(route.request().url()).pathname];
      return file ? route.fulfill({ path: path.join(root, file), contentType: file.endsWith('.js') ? 'text/javascript' : 'text/html' }) : route.abort();
    });
    await page.goto('http://demo.local/');
    await page.waitForFunction(() => typeof window.recordDemo === 'function');
    const video = await page.evaluate(() => window.recordDemo());
    fs.writeFileSync(path.join(__dirname, 'scared-ui-demo.webm'), Buffer.from(video, 'base64'));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
