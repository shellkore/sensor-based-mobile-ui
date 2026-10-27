# Sensor-Based Mobile UI

A UI library in development for building interfaces that respond to mobile device sensors. The goal is to offer a selection of reusable UI templates and components for React, Next.js, and React Native, so developers can choose the experience that fits their app.

## Project status

The first option, `ScaredUI`, is available for React and Next.js. The package is not published yet; React Native support is planned.

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

Install the package from a local checkout alongside React, then import `ScaredUI` as shown above. Run `npm test` to check the shared behavior. There is no build step.

To run or deploy the interactive demo app, see [demos/README.md](demos/README.md).

## npm publishing

The project is intended for publication on npm once it has a documented, tested public API. The root package is marked private to prevent an accidental release of this scaffold. Before publishing, choose and verify the package name and ownership, add a license, implement and test the package entry points for the supported platforms, and remove the `private` flag. Use `npm pack --dry-run` to inspect the package contents before publishing.

## Contributing

Issues and contributions are welcome. As sensor interactions and UI designs are decided, this README will document supported devices, setup, usage, and contribution checks.
