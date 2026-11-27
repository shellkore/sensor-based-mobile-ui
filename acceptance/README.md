# Browser acceptance tests

This standalone React app installs `sensor-based-mobile-ui@0.4.0` from npm. All 33 Playwright tests run against the installed package using Google Chrome on Windows or Playwright Chromium on Linux. The suite simulates hardware inputs.

From the repository root:

```sh
npm ci --prefix acceptance
# Linux: install the browser (Windows uses installed Google Chrome).
npx --prefix acceptance playwright install chromium
npm run test:ui
```

The suite covers the six sensor effects: default intensity, half/double strength, zero, clamping, invalid values, and changes while active without restarting sensors. It also checks reduced motion, sensor cleanup, permission denial/retry, and unsupported-device messaging. Customization checks cover sensitivity, custom enable/stop controls, wrapper styling, and pending-permission cancellation. Time is fixed for repeatable animation comparisons; React and the library's components run normally.

GestureUI tests use a synthetic Chromium camera and controlled hand landmarks. They check that pinching grabs one card, dragging moves it horizontally, and opening the fingers or losing tracking leaves it at the dropped position.

Verify and Release install the current checkout into the acceptance app to test changes before publishing. To reproduce that locally, run `npm install --prefix acceptance --no-save --package-lock=false --install-links .` from the repository root before running the tests. Run `npm ci --prefix acceptance` to restore the published package. On Linux CI, use `playwright install --with-deps chromium` to install browser system dependencies too.
