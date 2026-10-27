# Sensor-Based Mobile UI

A UI library in development for building interfaces that respond to mobile device sensors. The goal is to offer a selection of reusable UI templates and components for React, Next.js, and React Native, so developers can choose the experience that fits their app.

[Explore the live demo](https://sensor-based-mobile-ui.vercel.app/) · [Read the documentation](https://sensor-based-mobile-ui.vercel.app/docs)

If you like this project, please [star the repository](https://github.com/shellkore/sensor-based-mobile-ui) and consider sponsoring its development.

## Project status

`ScaredUI`, `CompassUI`, `TornadoUI`, and `EarthquakeUI` are available for React and Next.js. React Native support is planned. The package is not published yet.

### earthquakeUI

`EarthquakeUI` shakes and displaces its direct children in response to phone acceleration. Stronger movement creates a larger effect; after movement stops, the children slowly return to their original positions.

```jsx
import { EarthquakeUI } from 'sensor-based-mobile-ui';

<EarthquakeUI><button>One</button><button>Two</button></EarthquakeUI>
```

Tap Enable and allow motion access if prompted. HTTPS or localhost and a browser and device providing acceleration readings are required. Unsupported or denied access leaves children usable. The effect respects reduced-motion preferences. Each direct child receives an inline-block wrapper; React 18 or newer and a client component in Next.js are required.

### tornadoUI

`TornadoUI` moves its direct children in a swirling pattern when the phone rotates quickly. The effect fades when movement stops.

```jsx
import { TornadoUI } from 'sensor-based-mobile-ui';

<TornadoUI>
  <button>One</button>
  <button>Two</button>
</TornadoUI>
```

Tap Enable and allow motion access if prompted. This requires HTTPS or localhost and a browser and device that provide rotation-rate readings; access can also be blocked by browser or embedding settings. If unavailable, the children remain usable. Motion is disabled when the user prefers reduced motion. Each direct child receives an inline-block wrapper, which can change its layout. React 18 or newer is required; use a client component in Next.js.

### scaredUI

`ScaredUI` wraps each direct child and moves it when a shadow falls on the device's ambient light sensor. When the sensor is unavailable, users can opt in to a front-camera fallback that estimates changes in brightness. The interface keeps shaking while the view is darker, with stronger movement as it gets darker; a faster drop also causes temporary displacement. The first reading after enabling or recalibrating is the baseline, so keep the sensor or camera uncovered until calibration finishes.

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

React 18 or newer is a peer dependency. For Next.js, use this component from a client component. Sensor and camera access require a secure context (HTTPS or localhost), compatible hardware, and permission. Unsupported or denied access leaves the children usable and displays a message. Neither method measures distance: lighting changes and shadows can also trigger the effect. Recalibrate when the surrounding light changes. Motion is disabled when the user prefers reduced motion.

Safari and Chrome on iPhone do not currently expose the ambient light sensor through this API, so users can choose the camera fallback. It requests the front camera without audio and processes small frames locally; video is not saved or sent anywhere. The camera stops when the user selects Stop camera, leaves the page, or switches away from the tab. Cover enough of the front camera's view to darken it. Automatic exposure and changes in the scene can affect the response. Some Chromium browsers expose the sensor only behind an experimental flag.

Each direct child gets an inline-block wrapper, so its layout may differ from an unwrapped child. Use direct children for elements that should move independently.

### compassUI

`CompassUI` shifts its direct children toward magnetic north. Hold the phone flat with the screen facing up in portrait orientation, enable the experience, and rotate the phone: when its top points north, the children move up; when it points east, they move left. No starting direction or recalibration is needed.

```jsx
import { CompassUI } from 'sensor-based-mobile-ui';

export default function Example() {
  return (
    <CompassUI>
      <button>Explore</button>
      <button>Discover</button>
    </CompassUI>
  );
}
```

`MagneticUI` remains available as an alias for existing users. Magnetic sensing requires a secure context (HTTPS or localhost), compatible hardware, and permission. Where the browser exposes `Magnetometer`, the effect uses its x and y field readings to estimate magnetic north when the phone is flat. On iPhone, browsers can instead use the compass heading from device orientation events; tap Enable and allow motion and orientation access when prompted. Rotate the phone to see the effect. The compass fallback uses heading rather than field strength, and neither method locates a magnet. Magnetic north differs from geographic north; nearby magnets and tilted devices can affect accuracy. Support varies, and browser settings or embedding policies can block access. If access is unavailable or denied, the children remain usable and a message is displayed. Motion is limited and disabled when the user prefers reduced motion. As with `ScaredUI`, each direct child receives an inline-block wrapper. React 18 or newer is required; in Next.js, use a client component.

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

## Contributing

Issues and contributions are welcome. As sensor interactions and UI designs are decided, this README will document supported devices, setup, usage, and contribution checks.

## License

This project is licensed under the [MIT License](LICENSE).
