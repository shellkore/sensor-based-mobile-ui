# Sensor-Based Mobile UI

A UI library in development for building interfaces that respond to mobile device sensors. The goal is to offer a selection of reusable UI templates and components for React, Next.js, and React Native, so developers can choose the experience that fits their app.

[Explore the live demo](https://sensor-based-mobile-ui.vercel.app/) · [Read the documentation](https://sensor-based-mobile-ui.vercel.app/docs)

If you like this project, please [star the repository](https://github.com/shellkore/sensor-based-mobile-ui) and consider sponsoring its development.

## Project status

`ScaredUI`, `CompassUI`, `TornadoUI`, `EarthquakeUI`, `PulseUI`, and `GravityUI` are available for React and Next.js. React Native support is planned.

All components accept an `intensity` prop to control the strength of the visual effect (available since npm `0.2.0`). The default is `1`; use `0` for no effect, `0.5` for a gentler effect, or `2` for a stronger effect. Values are clamped to the range `0`–`2`; invalid values default to `1`. Changing the prop updates the effect while it is active. Sensor permissions and reduced-motion settings still apply.

```jsx
<GravityUI intensity={0.5}><button>One</button></GravityUI>
```

### Shared customization options

Since npm version `0.3.0`, all six components and the `MagneticUI` alias support custom controls, sensor sensitivity, and wrapper styling. Omitting these props keeps the default controls, wrappers, and sensor response.

| Prop | Default | Behavior |
| --- | --- | --- |
| `sensitivity` | `1` | Sensor response gain. Finite numbers are clamped to `0`–`2`; invalid values (including strings, `NaN`, and infinity) use `1`. `0` suppresses the effect without stopping sensor access. |
| `renderControls` | Built-in controls | Function receiving `{ status, enable, stop, disabled }` and returning React content to replace the built-in buttons and status message. Returning `null` hides controls. |
| `itemClassName` | None | Class applied to every direct child's animated wrapper, not the outer container or controls. |
| `itemStyle` | Existing wrapper styles | React style object merged over each wrapper's default styles. For example, override `display`, padding, border radius, or background. |

`className` continues to style the outer container. Animation owns wrapper `transform`, PulseUI's `boxShadow`, and GravityUI's transition while running; put independent transforms on your child instead. GravityUI honors an `itemStyle.transition` override unless reduced motion is requested. Avoid using wrapper styles to override reduced-motion behavior.

```jsx
<GravityUI
  intensity={0.5}
  sensitivity={1.5}
  itemClassName="sensor-card"
  itemStyle={{ display: 'block', padding: 16 }}
  renderControls={({ status, enable, stop, disabled }) => (
    <div>
      <button type="button" onClick={enable} disabled={disabled}>Enable tilt</button>
      <button type="button" onClick={stop}>Stop tilt</button>
      <p role="status">{status}</p>
    </div>
  )}
>
  <button>Explore</button>
</GravityUI>
```

Call `enable` from a user interaction so permission prompts remain supported. `disabled` indicates when the enable control should be disabled; keep a stop/cancel action available during permission requests. `stop` cancels pending requests, stops the current session, and clears library animation. Custom controls are responsible for accessible names, status announcements, and any translated messages. Common statuses include `idle`, `permission`, `starting`, `active`, `denied`, `unsupported`, and `unavailable`; media components also use `pending`, `stopped`, or camera-specific statuses. Compass orientation fallback reports `compass-active`.

ScaredUI additionally passes `startCamera`, `stopCamera`, and `recalibrate`. Camera access remains opt-in: explain that video is processed locally without recording or upload, and call `startCamera` only from an explicit user action. `recalibrate` resets an active camera baseline or restarts light-sensor calibration. Camera statuses include `camera-pending`, `camera-starting`, `camera-active`, `camera-dark`, and `camera-unavailable`. The light sensor can report `dark`. ScaredUI's `controlsAfter` and `animateControls` also apply to custom controls.

Sensitivity adjusts the sensor response before `intensity` scales the final effect:

- **PulseUI, EarthquakeUI, TornadoUI:** gain is applied to loudness, acceleration, or rotation speed before the existing thresholds and caps. Higher sensitivity can activate weaker inputs; higher intensity cannot bypass a threshold.
- **GravityUI:** tilt displacement gain increases while the sensor response stays bounded at 80px before intensity.
- **ScaredUI:** darkness relative to the calibrated baseline is amplified, capped at full darkness. Calibration itself is unchanged, including for the camera fallback.
- **CompassUI:** gain changes displacement while keeping the measured north direction; compass input has no activation threshold.

Changes do not restart sensors or repeat permission prompts. Gravity and motion-input changes apply on the next sensor reading; microphone and light effects update on animation frames. Existing earthquake/tornado impulses keep their natural decay when sensitivity is lowered; zero sensitivity suppresses them immediately. This does not replace real-device calibration, and reduced-motion preferences still take priority.

### gravityUI

`GravityUI` slides its direct children toward the lower edge as the phone tilts. Hold the phone flat to return them to their original positions.

```jsx
import { GravityUI } from 'sensor-based-mobile-ui';

<GravityUI><button>One</button><button>Two</button></GravityUI>
```

Tap Enable and allow orientation access if prompted. HTTPS or localhost and a device and browser providing orientation readings are required. Unsupported or denied access leaves children usable. The effect respects reduced-motion preferences. Each direct child receives an inline-block wrapper; React 18 or newer and a client component in Next.js are required.

### pulseUI

`PulseUI` expands and glows around its direct children in response to microphone loudness, then settles as the sound gets quieter.

```jsx
import { PulseUI } from 'sensor-based-mobile-ui';

<PulseUI><button>One</button><button>Two</button></PulseUI>
```

Tap Enable and allow microphone access. HTTPS or localhost, a microphone, and a compatible browser are required. Audio is processed locally and is not recorded or sent. The microphone stops when stopped, the page is hidden, or the component unmounts. Denied or unavailable access leaves children usable. Scaling respects reduced-motion preferences. Each direct child receives an inline-block wrapper; React 18 or newer and a client component in Next.js are required. Microphone sensitivity and browser audio processing affect the response.

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

`ScaredUI` wraps each direct child and moves it when a shadow falls on the device's ambient light sensor. When the sensor is unavailable, users can opt in to a front-camera fallback that estimates changes in brightness. The interface keeps shaking and compresses vertically while the view is darker, with a stronger effect as it gets darker; a faster drop also causes temporary displacement. The first reading after enabling or recalibrating is the baseline, so keep the sensor or camera uncovered until calibration finishes.

By default, controls appear before the children and stay still. Set `controlsAfter` to a zero-based child index to place them after that child, and set `animateControls` to make the controls move too.

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

Install the package in a React 18 or newer application:

```bash
npm install sensor-based-mobile-ui
```

For Next.js, import the components from a client component:

```jsx
'use client';

import { GravityUI } from 'sensor-based-mobile-ui';

export default function Example() {
  return <GravityUI><button>Tilt your phone</button></GravityUI>;
}
```

To work on the library locally, clone the repository:

```bash
git clone https://github.com/shellkore/sensor-based-mobile-ui.git
cd sensor-based-mobile-ui
```

You can also install the package from a local checkout alongside React. Run `npm test` to check the shared behavior. There is no build step.

To run or deploy the interactive demo app, see [demos/README.md](demos/README.md).

## Contributing

Run `npm test` for the core checks and see [acceptance/README.md](acceptance/README.md) for browser acceptance tests in a fresh React consumer app (`npm run test:ui`). Verify and Release also run these UI tests against the current checkout.

Work on a feature branch and open a pull request to `main`. The Verify workflow runs the tests, builds the demo, and checks the npm package. Merge only after the checks and review pass. Configure a GitHub branch protection rule or ruleset for `main` to require a pull request and the `test` status check; the workflow alone does not prevent direct pushes or merges.

Use conventional commit messages (and a conventional pull request title when using squash merge), since semantic-release reads the commits that land on `main`:

- `fix: correct motion handling` publishes a patch release.
- `feat: add intensity control` publishes a minor release.
- A commit containing a `BREAKING CHANGE:` footer publishes a major release.
- `docs: ...`, `test: ...`, and `chore: ...` do not normally trigger a release.

After a push or merge to `main`, the Release workflow reruns the checks and, if the commits warrant it, publishes to npm and creates a GitHub release and tag. It uses GitHub Actions trusted publishing, so no npm token is needed. The repository's `package.json` version is not committed on each release; semantic-release sets the published version based on Git tags.

### One-time release setup

1. In [npm package settings](https://www.npmjs.com/package/sensor-based-mobile-ui/access), configure a GitHub Actions trusted publisher for owner `shellkore`, repository `sensor-based-mobile-ui`, and workflow filename `release.yml`. Allow publishing, and leave the environment name blank. The workflow must exist on GitHub before npm can validate it.
2. Add and push a `v0.1.0` tag on the commit corresponding to the already published npm version. The initial npm package was published from a working tree with uncommitted changes, so first verify the closest appropriate baseline in the repository; do not tag the later intensity change as already released. Semantic-release uses this tag as its release baseline. The workflow refuses to release until the tag exists in main's history.
3. The existing intensity commit is named `Add configurable effect intensity`, so it does not itself trigger semantic-release. To include it in the next release, merge a pull request with an appropriate conventional `feat:` commit or squash title after the baseline tag. This will include all changes since the baseline.
4. Enable GitHub Actions. GitHub automatically supplies `secrets.GITHUB_TOKEN`; do not create a repository secret with that name or add a personal access token. The Release job requests the write permissions needed to create releases and tags, plus `id-token: write` for npm trusted publishing. No `NPM_TOKEN` repository secret is needed. Configure the branch rules mentioned above. Once the trusted publisher and tag are set up, rerun the Release workflow from the Actions tab if needed.

Releases are fully automatic when qualifying changes reach `main`; test changes on the pull request before merging.

## License

This project is licensed under the [MIT License](LICENSE).
