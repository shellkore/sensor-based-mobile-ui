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
  ['ScaredUI', '/scared', 'Responds to shadows using ambient light or an optional front-camera fallback.'],
  ['CompassUI', '/compass', 'Moves elements toward magnetic north using compass or orientation readings.'],
  ['TornadoUI', '/tornado', 'Swirls elements when the phone rotates, then lets them settle.'],
  ['EarthquakeUI', '/earthquake', 'Scatters elements when the phone shakes, then lets them recover.']
];

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
        <section id="usage"><span className="docs-index">02 / YOUR FIRST INTERACTION</span><h2>Wrap the things that move</h2><p>Import a component and add the elements you want to animate as direct children. In Next.js, put this example in a client component.</p><pre><code>{example}</code></pre><p>Each direct child gets a wrapper, which can affect layout. The component includes an enable control for sensor access.</p></section>
        <section id="ui-options"><span className="docs-index">03 / THE COLLECTION</span><h2>Choose an experience</h2><div className="docs-components">{components.map(([name, href, description]) => <a className="docs-component" href={href} key={name}><div><h3>{name}</h3><p>{description}</p></div><span aria-hidden="true">↗</span></a>)}</div></section>
        <section id="requirements"><span className="docs-index">04 / BEFORE YOU BUILD</span><h2>Devices &amp; permissions</h2><p>Sensor access requires a compatible device and browser, a secure context (HTTPS or localhost), and any required permissions. Support varies; if access is unavailable or denied, children stay usable. Effects respect reduced-motion preferences.</p><p>Camera access is optional for ScaredUI. React Native support is planned; the current components target React and Next.js on the web.</p><a className="docs-source" href="https://github.com/shellkore/sensor-based-mobile-ui">Read the full README on GitHub ↗</a></section>
      </article>
      <aside className="docs-aside"><div className="eyebrow"><span className="dash" /> UI OPTIONS</div><p>Choose what moves you.</p><nav aria-label="UI options">{components.map(([name, href]) => <a href={href} key={name}>{name} <span aria-hidden="true">↗</span></a>)}</nav></aside>
    </div>
  </main>;
}
