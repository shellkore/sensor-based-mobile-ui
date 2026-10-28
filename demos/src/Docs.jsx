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
  ['ui-options', 'UI options'],
  ['requirements', 'Devices & permissions']
];

export default function Docs() {
  return <main className="docs-page">
    <div className="eyebrow"><span className="pulse" /> BUILD WITH SENSOR UI</div>
    <h1>Made to <em>move.</em></h1>
    <p className="docs-lead">Bring a little more life to your interfaces with React components that respond to the world around them.</p>
    <div className="docs-notice"><strong>Coming soon to npm</strong><p>The package is not published yet. Until then, use a local checkout to try it in your project.</p></div>
    <nav className="docs-index-nav" aria-label="On this page"><span className="docs-index">ON THIS PAGE</span><div>{sections.map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, '0')}</span>{label} <span aria-hidden="true">↘</span></a>)}</div></nav>
    <div className="docs-layout">
      <article className="docs-content">
        <section id="getting-started"><span className="docs-index">01 / GET STARTED</span><h2>Install from a local checkout</h2><p>Clone the repository, then install its local path in your React or Next.js project. React 18 or newer is required.</p><pre><code>{`git clone https://github.com/shellkore/sensor-based-mobile-ui.git\ncd your-react-app\nnpm install react /path/to/sensor-based-mobile-ui`}</code></pre><p>Replace <code>/path/to/sensor-based-mobile-ui</code> with the path to your cloned repository.</p></section>
        <section id="usage"><span className="docs-index">02 / YOUR FIRST INTERACTION</span><h2>Wrap the things that move</h2><p>Import a component and add the elements you want to animate as direct children. In Next.js, put this example in a client component.</p><pre><code>{example}</code></pre><p>Each direct child gets a wrapper, which can affect layout. All components accept <code>children</code> and an optional <code>className</code> applied to the outer container. They include an enable control and a status message for sensor access.</p></section>
        <section id="ui-options"><span className="docs-index">03 / THE COLLECTION</span><h2>Choose an experience</h2><div className="docs-components">{components.map(({ name, id, description }) => <a className="docs-component" href={`#${id}`} key={id}><div><h3>{name}</h3><p>{description}</p></div><span aria-hidden="true">↘</span></a>)}</div></section>
        {components.map(({ name, id, demo, description, requirements, instructions, limitations }) => <section id={id} key={id}>
          <span className="docs-index">UI OPTION / {name.toUpperCase()}</span><h2>{name}</h2><p>{description}</p>
          <h3>Usage</h3><pre><code>{componentExample(name)}</code></pre><p>{instructions}</p>
          <h3>Sensor requirements</h3><p>{requirements}</p>
          <h3>What to know</h3><p>{limitations}</p><a className="docs-source" href={demo}>Try the {name} demo ↗</a>
        </section>)}
        <section id="requirements"><span className="docs-index">04 / BEFORE YOU BUILD</span><h2>Devices &amp; permissions</h2><p>Sensor access requires a compatible device and browser, a secure context (HTTPS or localhost), and any required permissions. Support varies; if access is unavailable or denied, children stay usable. Effects respect reduced-motion preferences.</p><p>Camera access is optional for ScaredUI. React Native support is planned; the current components target React and Next.js on the web.</p><a className="docs-source" href="https://github.com/shellkore/sensor-based-mobile-ui">Read the full README on GitHub ↗</a></section>
      </article>
      <aside className="docs-aside"><div className="eyebrow"><span className="dash" /> UI OPTIONS</div><p>Choose what moves you.</p><nav aria-label="UI options">{components.map(({ name, id }) => <a href={`#${id}`} key={id}>{name} <span aria-hidden="true">↘</span></a>)}</nav></aside>
    </div>
  </main>;
}
