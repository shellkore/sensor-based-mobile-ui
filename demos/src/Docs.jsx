import React from 'react';

const example = `'use client'; // Required in a Next.js client component

import { ScaredUI } from 'sensor-based-mobile-ui';

export default function Example() {
  return (
    <ScaredUI>
      <button>Explore</button>
      <button>Discover</button>
    </ScaredUI>
  );
}`;

const components = [
  {
    name: 'GestureUI', id: 'gesture-ui', demo: '/gesture',
    description: 'Grab and move a card sideways with a pinch. Available on npm since 0.4.0.',
    requirements: 'A camera, HTTPS or localhost, and network access for the hand-tracking runtime and model.',
    instructions: 'Enable hand tracking, show an open hand and aim the dot at a card. Pinch to grab it and open your fingers to leave it in place.',
    limitations: 'Tracks one hand. Losing sight of it drops the card. Camera frames stay on the device and switching tabs stops tracking.'
  },
  {
    name: 'GravityUI', id: 'gravity-ui', demo: '/gravity',
    description: 'Moves cards toward the lower edge as the phone tilts.',
    requirements: 'HTTPS or localhost and a device and browser that provide orientation readings. Allow orientation access if prompted.',
    instructions: 'Tap Enable and tilt the phone. The children slide in the direction of the tilt and return when the phone is flat.',
    limitations: 'Orientation support and permissions vary by device, browser, and embedding settings. If no reading arrives, the component reports it and offers a retry.'
  },
  {
    name: 'PulseUI', id: 'pulse-ui', demo: '/pulse',
    description: 'Expands and glows in response to sound from the microphone.',
    requirements: 'HTTPS or localhost, a microphone, and permission to use it.',
    instructions: 'Tap Enable, allow microphone access, then play music, speak, or clap. The cards settle as the sound gets quieter.',
    limitations: 'Audio is processed locally and is not recorded or sent. The microphone stops when you stop it, leave the page, or switch tabs. Loudness varies with the microphone and its processing.'
  },
  {
    name: 'ScaredUI', id: 'scared-ui', demo: '/scared',
    description: 'Responds to shadows using ambient light or an optional front-camera fallback.',
    requirements: 'A compatible AmbientLightSensor, or a front camera for the optional fallback, plus HTTPS or localhost and permission where required. The ambient light API is not available in Safari or Chrome on iPhone; choose the camera fallback there.',
    instructions: 'Keep the sensor or camera uncovered, tap Enable, and wait for the first reading to establish a baseline. Cover it to make the children shake; uncover it to stop. Recalibrate when the surrounding light changes.',
    limitations: 'Light and camera exposure measure brightness, not distance, so shadows or lighting changes can trigger movement. Camera frames are processed locally without audio; video is not saved or sent. The camera stops when you stop it, leave the page, or switch tabs.'
  },
  {
    name: 'CompassUI', id: 'compass-ui', demo: '/compass',
    description: 'Moves elements toward magnetic north using compass or orientation readings.',
    requirements: 'HTTPS or localhost and a compatible magnetometer, or a device-orientation event that provides a compass heading. On iPhone, allow motion and orientation access when prompted.',
    instructions: 'Hold the phone flat, screen up, in portrait orientation. Tap Enable and rotate the device: the children move toward magnetic north relative to the screen. No calibration direction is needed.',
    limitations: 'Magnetic north differs from geographic north; tilting the device or nearby magnetic interference can affect the direction. Availability and accuracy depend on the device and browser.'
  },
  {
    name: 'TornadoUI', id: 'tornado-ui', demo: '/tornado',
    description: 'Swirls elements when the phone rotates, then lets them settle.',
    requirements: 'HTTPS or localhost and a browser and device that expose DeviceMotionEvent rotation-rate readings. Allow motion access if prompted.',
    instructions: 'Tap Enable, then rotate the phone quickly. Faster rotation creates a stronger swirl around the group of children; the effect fades as the device stops.',
    limitations: 'Motion sensor support and permissions vary by device, browser, and embedding settings. If no rotation reading arrives, the component reports it and offers a retry.'
  },
  {
    name: 'EarthquakeUI', id: 'earthquake-ui', demo: '/earthquake',
    description: 'Scatters elements when the phone shakes, then lets them recover.',
    requirements: 'HTTPS or localhost and a browser and device that expose DeviceMotionEvent acceleration readings. Allow motion access if prompted.',
    instructions: 'Tap Enable and shake the phone. Stronger acceleration moves the children farther; they gradually return after movement stops.',
    limitations: 'Motion sensor support and permissions vary by device, browser, and embedding settings. If no acceleration reading arrives, the component reports it and offers a retry.'
  }
];

const componentExample = name => `'use client'; // For Next.js client components\n\nimport { ${name} } from 'sensor-based-mobile-ui';\n\nexport default function Example() {\n  return (\n    <${name} className="my-experience">\n      <button>Explore</button>\n      <button>Discover</button>\n    </${name}>\n  );\n}`;

const sections = [
  ['getting-started', 'Getting started'],
  ['usage', 'Usage'],
  ['customization', 'Customization'],
  ['ui-options', 'UI options'],
  ['requirements', 'Devices & permissions']
];

export default function Docs() {
  return <main className="docs-page">
    <div className="eyebrow"><span className="pulse" /> BUILD WITH SENSOR UI</div>
    <h1>Made to <em>move.</em></h1>
    <p className="docs-lead">Bring a little more life to your interfaces with React components that respond to the world around them.</p>
    <div className="docs-notice"><strong>Available on npm</strong><p>Version 0.4.0 adds GestureUI for camera-based pinch, drag, and drop. Version 0.3.0 introduced custom controls, sensor sensitivity, and wrapper styling. Effect intensity has been available since 0.2.0.</p></div>
    <nav className="docs-index-nav" aria-label="On this page"><span className="docs-index">ON THIS PAGE</span><div>{sections.map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, '0')}</span>{label} <span aria-hidden="true">↘</span></a>)}</div></nav>
    <div className="docs-layout">
      <article className="docs-content">
        <section id="getting-started"><span className="docs-index">01 / GET STARTED</span><h2>Install the package</h2><p>Install it in your React or Next.js project. React 18 or newer is required.</p><pre><code>npm install sensor-based-mobile-ui</code></pre></section>
        <section id="usage"><span className="docs-index">02 / YOUR FIRST INTERACTION</span><h2>Wrap the things that move</h2><p>Import a component and add the elements you want to animate as direct children. In Next.js, put this example in a client component.</p><pre><code>{example}</code></pre><p>Each direct child gets a wrapper, which can affect layout. All components accept <code>children</code> and an optional <code>className</code> applied to the outer container. They include an enable control and a status message for sensor access.</p><h3>Control intensity</h3><p>Since npm 0.2.0, the six sensor effects accept an <code>intensity</code> prop. The default is 1; use 0 to remove the visual effect, 0.5 for a gentler effect, or 2 for a stronger effect. Values are clamped from 0 to 2; invalid values use 1. Changes take effect while the component is active, and reduced-motion preferences still apply.</p><pre><code>{`<GravityUI intensity={0.5}><button>Explore</button></GravityUI>`}</code></pre></section>
        <section id="customization"><span className="docs-index">03 / CUSTOMIZATION</span><h2>Make the effects your own</h2>
          <p>All six components and the MagneticUI alias support these props starting in 0.3.0. Omit them to keep the default controls, sensor response, and wrapper styles.</p>
          <h3>Sensor sensitivity</h3><p><code>sensitivity</code> defaults to 1. Finite numbers are clamped to 0-2; invalid values use 1. Zero suppresses the effect without stopping sensor access. Audio, acceleration, and rotation gain are applied before their existing thresholds and caps. Gravity amplifies the tilt response, capped at 80px before intensity. ScaredUI amplifies darkness relative to its unchanged calibrated baseline. CompassUI changes displacement gain without changing north direction.</p>
          <p><code>intensity</code> scales the resulting visual effect. Sensitivity changes do not restart sensors: motion changes apply on the next reading, while microphone and light effects update on animation frames. Existing earthquake and tornado impulses decay naturally when sensitivity is lowered; zero suppresses them immediately. Reduced-motion preferences still take priority.</p>
          <h3>Wrapper styles</h3><p><code>itemClassName</code> and <code>itemStyle</code> style every animated child wrapper, while <code>className</code> styles the outer container. Styles merge over the existing defaults, so you can change display, padding, background, and border radius. Animation owns transform and PulseUI's box shadow; apply independent transforms to the child instead. GravityUI honors a custom transition except when reduced motion is requested.</p>
          <h3>Your own controls</h3><p><code>renderControls</code> receives <code>{'{ status, enable, stop, disabled }'}</code>. Return your own buttons and accessible status message, or null to hide controls. Call enable from a user action and honor disabled; keep stop available to cancel pending permission requests. Stop cancels the session and clears its animation. The default controls remain when renderControls is omitted.</p>
          <pre><code>{`<GravityUI
  sensitivity={1.5}
  intensity={0.5}
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
</GravityUI>`}</code></pre>
          <p>Translate the status codes into your own messages. Common codes are idle, permission, starting, active, denied, unsupported, and unavailable. PulseUI also uses pending and stopped. Compass fallback uses compass-active. ScaredUI additionally passes startCamera, stopCamera, and recalibrate; it reports dark, stopped, and camera-pending/starting/active/dark/unavailable states. Camera use must remain an explicit user choice with a local-processing explanation. Recalibrate resets the camera baseline or restarts the light sensor. ScaredUI's controlsAfter and animateControls also apply to custom controls.</p>
        </section>
        <section id="ui-options"><span className="docs-index">04 / THE COLLECTION</span><h2>Choose an experience</h2><div className="docs-components">{components.map(({ name, id, description }) => <a className="docs-component" href={`#${id}`} key={id}><div><h3>{name}</h3><p>{description}</p></div><span aria-hidden="true">↘</span></a>)}</div></section>
        {components.map(({ name, id, demo, description, requirements, instructions, limitations }) => <section id={id} key={id}>
          <span className="docs-index">UI OPTION / {name.toUpperCase()}</span><h2>{name}</h2><p>{description}</p>
          <h3>Usage</h3><pre><code>{componentExample(name)}</code></pre><p>{instructions}</p>
          <h3>Sensor requirements</h3><p>{requirements}</p>
          <h3>What to know</h3><p>{limitations}</p><a className="docs-source" href={demo}>Try the {name} demo ↗</a>
        </section>)}
        <section id="requirements"><span className="docs-index">05 / BEFORE YOU BUILD</span><h2>Devices &amp; permissions</h2><p>Sensor access requires a compatible device and browser, a secure context (HTTPS or localhost), and any required permissions. Support varies; if access is unavailable or denied, children stay usable. Effects respect reduced-motion preferences.</p><p>Camera access is optional for ScaredUI. React Native support is planned; the current components target React and Next.js on the web.</p><a className="docs-source" href="https://github.com/shellkore/sensor-based-mobile-ui">Read the full README on GitHub ↗</a></section>
      </article>
      <aside className="docs-aside"><div className="eyebrow"><span className="dash" /> UI OPTIONS</div><p>Choose what moves you.</p><nav aria-label="UI options">{components.map(({ name, id }) => <a href={`#${id}`} key={id}>{name} <span aria-hidden="true">↘</span></a>)}</nav></aside>
    </div>
  </main>;
}
