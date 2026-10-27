# Sensor-Based Mobile UI

A UI library in development for building interfaces that respond to mobile device sensors. The goal is to offer a selection of reusable UI templates and components for React, Next.js, and React Native, so developers can choose the experience that fits their app.

## Project status

`ScaredUI` and `MagneticUI` are available for React and Next.js. React Native support is planned. The package is not published yet.

### scaredUI

`ScaredUI` wraps each direct child and moves it when a shadow falls on the device's ambient light sensor. A faster drop in light produces a stronger shake and temporary displacement. The first reading after enabling or recalibrating is the baseline, so keep the sensor uncovered until calibration finishes.

```jsx
import { ScaredUI } from 'sensor-based-mobile-ui';

export default function Example() {
  return (
    <ScaredUI>
      <button>One</button>
      <button>Two</button>
    </ScaredUI>
  );
}
```

React 18 or newer is a peer dependency. For Next.js, use this component from a client component. The browser must expose `AmbientLightSensor` in a secure context (HTTPS or localhost), and the device must have a usable sensor. Browser support is limited, and permissions or embedding policies can block access. Unsupported or denied access leaves the children usable and displays a message. The sensor measures light, not distance: lighting changes and shadows can also trigger the effect. Recalibrate when the surrounding light changes. Motion is disabled when the user prefers reduced motion.

Each direct child gets an inline-block wrapper, so its layout may differ from an unwrapped child. Use direct children for elements that should move independently.

### magneticUI

`MagneticUI` moves its direct children in response to changes in the device's magnetic field. Hold the device still while enabling it: the first valid reading is the baseline. Rotate or move the device to change the reading, and recalibrate to set a new baseline.

```jsx
import { MagneticUI } from 'sensor-based-mobile-ui';

export default function Example() {
  return (
    <MagneticUI>
      <button>Explore</button>
      <button>Discover</button>
    </MagneticUI>
  );
}
```

The browser must expose `Magnetometer` in a secure context (HTTPS or localhost), with a usable sensor and permission to access it. Support is limited and embedding policies can block access. Unsupported or denied access leaves the children usable and displays a message. The effect uses changes in the sensor's x and y field readings, including changes caused by device rotation or nearby magnetic objects; it does not locate a magnet. Motion is limited and disabled when the user prefers reduced motion. As with `ScaredUI`, each direct child receives an inline-block wrapper. React 18 or newer is required; in Next.js, use a client component.

## Planned structure

```text
src/
  core/          Shared, platform-independent behavior
  react/         React and Next.js UI components and templates
  react-native/  React Native UI components and templates
examples/
  web/           React and Next.js examples
  mobile/        React Native examples
demos/           Vercel-ready React app for interactive web demos
```

Each platform can offer multiple UI options. Shared code should remain independent of browser and native APIs; platform-specific code will handle device access and presentation. Sensor selection, permissions, fallback behavior, and accessibility will be designed alongside each feature.

## Getting started

Clone the repository to follow development:

```bash
git clone https://github.com/shellkore/sensor-based-mobile-ui.git
cd sensor-based-mobile-ui
```

Install the package from a local checkout alongside React, then import either component as shown above. Run `npm test` to check the shared behavior. There is no build step.

To run or deploy the interactive demo app, see [demos/README.md](demos/README.md).

## npm publishing

The package is configured as `sensor-based-mobile-ui` at version `0.1.0`. Publishing creates its public npm page; the page does not need to be created separately.

1. Create an [npm account](https://www.npmjs.com/signup), verify your email, and enable [two-factor authentication](https://docs.npmjs.com/configuring-two-factor-authentication/).
2. In a terminal at the repository root, sign in and confirm the account:

   ```bash
   npm login
   npm whoami
   ```

3. Check whether the name is available at [npmjs.com/package/sensor-based-mobile-ui](https://www.npmjs.com/package/sensor-based-mobile-ui). If it is taken, change `name` in `package.json` and update the import examples. For a package under your npm account scope, use `@YOUR_NPM_USERNAME/sensor-based-mobile-ui` and publish with `npm publish --access public`.
4. Choose a license before distributing the library. Until then, `package.json` says `UNLICENSED` and the repository does not grant an open-source license. Review the code and README you intend to release, then check the tests and package contents:

   ```bash
   npm test
   npm pack --dry-run
   ```

5. Publish from the repository root, following any npm authentication or 2FA prompts:

   ```bash
   npm publish
   ```

After publishing, install it with `npm install sensor-based-mobile-ui react` and find its page at [npmjs.com/package/sensor-based-mobile-ui](https://www.npmjs.com/package/sensor-based-mobile-ui). A published name and version cannot be reused, so increment the version for later releases (for example, `npm version patch`), review the package, and run `npm publish` again. See the [npm publishing guide](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages/) for details.

## Contributing

Issues and contributions are welcome. As sensor interactions and UI designs are decided, this README will document supported devices, setup, usage, and contribution checks.
