# Browser acceptance tests

This standalone React app installs `sensor-based-mobile-ui@0.2.0` from npm, without a source alias or workspace link. Playwright checks the rendered transforms in installed Chrome on Windows and Playwright Chromium on Linux. Hardware inputs are simulated; real-device calibration and camera capture still need manual testing.

From the repository root:

```sh
npm ci --prefix acceptance
# Linux: install the browser (Windows uses installed Google Chrome).
npx --prefix acceptance playwright install chromium
npm run test:ui
```

The suite covers all six components: default intensity, half/double strength, zero, clamping, invalid values, and changes while active without restarting sensors. It also checks reduced motion, sensor cleanup, permission denial/retry, and unsupported-device messaging. Time is fixed for repeatable animation comparisons; React and the library's components run normally.

To test the current checkout instead of the released package, after `npm ci` run:

```sh
npm install --prefix acceptance --no-save --package-lock=false --install-links .
npm run test:ui
```

Verify and Release use this checkout installation so new library changes are tested before publishing. Run `npm ci --prefix acceptance` again to restore the published-package installation. On Linux CI, use `playwright install --with-deps chromium` to install browser system dependencies too.
