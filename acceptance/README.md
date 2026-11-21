# Browser acceptance tests

This standalone React app installs `sensor-based-mobile-ui@0.2.0` from npm, without a source alias or workspace link. Playwright checks the rendered transforms in installed Chrome on Windows and Playwright Chromium on Linux. Hardware inputs are simulated; real-device calibration and camera capture still need manual testing.

From the repository root:

```sh
npm ci --prefix acceptance
npm install --prefix acceptance --no-save --package-lock=false --install-links .
# Linux: install the browser (Windows uses installed Google Chrome).
npx --prefix acceptance playwright install chromium
npm run test:ui
```

The suite covers all six components: default intensity, half/double strength, zero, clamping, invalid values, and changes while active without restarting sensors. It also checks reduced motion, sensor cleanup, permission denial/retry, and unsupported-device messaging. Customization checks cover sensitivity, custom enable/stop controls, wrapper styling, and pending-permission cancellation. Time is fixed for repeatable animation comparisons; React and the library's components run normally.

The commands above install the current checkout into the consumer app. The new customization tests require this until those options are published. The pinned npm `0.2.0` package supports only the original intensity tests. To check that release alone, restore it with `npm ci --prefix acceptance`, then run `npm test --prefix acceptance -- --grep "intensity scales|reduced motion|^permission denial|^missing orientation"`.

Verify and Release use this checkout installation so new library changes are tested before publishing. Run `npm ci --prefix acceptance` again to restore the published-package installation. On Linux CI, use `playwright install --with-deps chromium` to install browser system dependencies too.
