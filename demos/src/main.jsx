import React from 'react';
import { createRoot } from 'react-dom/client';
import { ScaredUI, CompassUI, TornadoUI, EarthquakeUI, PulseUI, GravityUI, GestureUI } from '../../src/react/index.js';
import './style.css';
import Docs from './Docs.jsx';
import NotFound from './NotFound.jsx';

function scrollToExperiments(event) {
  const section = document.getElementById('experiments');
  if (section) {
    event.preventDefault();
    section.scrollIntoView();
  }
}

function Header() {
  return <header className="header"><a className="brand" href="/" aria-label="Sensor UI Lab home"><span className="brand-icon">✳</span><span>SENSOR<span className="brand-accent">/</span>UI<small>INTERACTION LAB</small></span></a><nav aria-label="Main navigation"><a href="/#experiments" onClick={scrollToExperiments}>Experiments</a><a href="/docs">Docs</a><a className="nav-link" href="/#experiments" onClick={scrollToExperiments}>Enter the lab <span>↗</span></a></nav></header>;
}

function Footer() {
  return <footer className="footer"><span>✳ &nbsp; SENSOR/UI LAB</span><a href="https://github.com/shellkore/sensor-based-mobile-ui">GITHUB ↗</a><span>DESIGNED TO FEEL SOMETHING <i>✳</i></span></footer>;
}

function Home() {
  React.useEffect(() => {
    if (window.location.hash === '#experiments') {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      document.getElementById('experiments')?.scrollIntoView();
    }
  }, []);

  return <><main><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="pulse" /> A NEW KIND OF INTERFACE <span className="eyebrow-index">/ 001</span></div><h1>Interfaces<br />that <em>feel.</em></h1><p>What if your screen could sense the world around it? Explore a collection of interfaces that respond to you, in real time.</p><a className="button button-primary" href="#experiments" onClick={scrollToExperiments}>Explore experiments <span>↘</span></a><div className="hero-caption"><span>✳</span> A LITTLE LESS STATIC.<br />&nbsp;&nbsp;&nbsp;&nbsp; A LOT MORE ALIVE.</div></div><div className="hero-art" aria-hidden="true"><div className="art-label art-label-top">SENSOR INPUT <span>● ACTIVE</span></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orb"><div className="orb-core">✳</div></div><div className="art-cross cross-one">+</div><div className="art-cross cross-two">+</div><div className="art-label art-label-bottom"><span>RESPONSIVE BY NATURE</span><span>07 / 07</span></div></div></section>
    <section className="github-callout"><div><div className="eyebrow"><span className="dash" /> OPEN SOURCE</div><h2>Build something that <em>moves.</em></h2><p>Explore the code and bring sensor-responsive interactions into your own projects.</p></div><a className="button nav-link" href="https://github.com/shellkore/sensor-based-mobile-ui">View on GitHub <span>↗</span></a></section>
    <section className="gallery" id="experiments"><div className="section-head"><div><div className="eyebrow"><span className="dash" /> THE COLLECTION</div><h2>Pick your <em>experience.</em></h2></div><p>A growing collection of small experiments in human-device interaction.</p></div><a className="experiment-card" href="/scared"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">✳</div><span className="visual-index">EXPERIMENT / 001</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>01 / AMBIENT LIGHT</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>scaredUI<span>↗</span></h3><p>An interface that gets the jitters when you get a little too close.</p><div className="card-footer"><span>LIGHT-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/compass"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">◎</div><span className="visual-index">EXPERIMENT / 002</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>02 / COMPASS</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>compassUI<span>↗</span></h3><p>An interface drawn toward magnetic north.</p><div className="card-footer"><span>HEADING-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/tornado"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">✳</div><span className="visual-index">EXPERIMENT / 003</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>03 / MOTION</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>tornadoUI<span>↗</span></h3><p>Rotate your phone to stir up a little storm.</p><div className="card-footer"><span>MOTION-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/earthquake"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">↯</div><span className="visual-index">EXPERIMENT / 004</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>04 / MOTION</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>earthquakeUI<span>↗</span></h3><p>Shake your phone and watch the interface quake and slowly recover.</p><div className="card-footer"><span>MOTION-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/pulse"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">◉</div><span className="visual-index">EXPERIMENT / 005</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>05 / MICROPHONE</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>pulseUI<span>↗</span></h3><p>Sound makes the interface expand and glow.</p><div className="card-footer"><span>SOUND-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/gravity"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">↓</div><span className="visual-index">EXPERIMENT / 006</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>06 / ORIENTATION</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>gravityUI<span>↗</span></h3><p>Tilt your phone and watch the cards slide toward the lower edge.</p><div className="card-footer"><span>TILT-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/gesture"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">↔</div><span className="visual-index">EXPERIMENT / 007</span></div><div className="card-content"><div className="card-meta">07 / HAND TRACKING</div><h3>gestureUI<span>↗</span></h3><p>Pinch a card, carry it sideways, and open your hand to drop it.</p><div className="card-footer"><span>CAMERA</span><span>EXPLORE EXPERIENCE →</span></div></div></a><div className="collection-end"><span>MORE EXPERIMENTS IN THE MAKING</span><span>✳</span></div></section></main></>;
}

function renderLabControls({ status, enable, disabled, stop, startCamera, recalibrate }) {
  return <section className="lab-controls" aria-label="Custom sensor controls">
    <button type="button" onClick={enable} disabled={disabled}>Start sensor</button>
    <button type="button" onClick={stop}>Stop</button>
    {startCamera && <>
      <p>Camera mode measures light on this device without recording or uploading video.</p>
      <button type="button" onClick={startCamera} disabled={disabled}>Use front camera</button>
      <button type="button" onClick={recalibrate}>Recalibrate light</button>
    </>}
    <p role="status">Sensor status: {status.replaceAll('-', ' ')}</p>
  </section>;
}

function useDemoSettings() {
  const [sensitivity, setSensitivity] = React.useState(1);
  const [customControls, setCustomControls] = React.useState(false);
  const [framed, setFramed] = React.useState(false);
  const settings = <fieldset className="lab-settings">
    <legend>Customize this experiment</legend>
    <label>Sensitivity · {sensitivity.toFixed(1)}×
      <input type="range" min="0" max="2" step="0.1" value={sensitivity}
        onChange={event => setSensitivity(event.target.valueAsNumber)} />
    </label>
    <label><input type="checkbox" checked={customControls}
      onChange={event => setCustomControls(event.target.checked)} /> Custom sensor controls</label>
    <label><input type="checkbox" checked={framed}
      onChange={event => setFramed(event.target.checked)} /> Frame item wrappers</label>
  </fieldset>;
  return { settings, props: { sensitivity, renderControls: customControls ? renderLabControls : undefined,
    itemClassName: framed ? 'lab-framed' : undefined } };
}

function Scared() {
  const { settings, props } = useDemoSettings();
  return <main className="scared-experience"><ScaredUI {...props} className="scared-world" controlsAfter={5} animateControls>
    <Header />
    <a className="back-link world-back" href="/">← &nbsp; ALL EXPERIMENTS</a>
    <div className="eyebrow world-eyebrow"><span className="pulse" /> EXPERIMENT 001 <span className="eyebrow-index">/ AMBIENT LIGHT</span></div>
    <h1 className="world-title">Meet <em>scaredUI.</em></h1>
    <div><p className="world-lead">A little shy, all over. Bring your hand near the light sensor or front camera and watch the whole page react.</p>{settings}</div>
    <section className="world-instructions"><div className="label"><span>✳</span> HOW IT WORKS</div><h2>Make it <em>nervous.</em></h2><p>Keep the sensor or camera uncovered while you enable the experience. Then cover it with your hand and watch the page shiver. Move quickly to make it scatter further.</p><p className="sensor-note">If the light sensor is unavailable, you can choose the front camera. Changing light or camera exposure can affect the response.</p></section>
    <div className="tile tile-wide"><span className="tile-icon">✳</span><span className="tile-bottom"><strong>Make some magic</strong><small>A little inspiration for today.</small></span><span className="tile-arrow">↗</span></div>
    <div className="tile tile-purple"><span className="tile-icon">✦</span><span className="tile-bottom"><strong>Daydream</strong><small>Let your mind wander</small></span></div>
    <div className="tile tile-blue"><span className="tile-icon">◒</span><span className="tile-bottom"><strong>Discover</strong><small>See what’s out there</small></span></div>
    <p className="world-end"><span className="pulse" /> YOUR DEVICE IS THE CONTROLLER</p>
    <Footer />
  </ScaredUI></main>;
}

const worlds = {
  '/compass': { UI: CompassUI, number: '002', sensor: 'COMPASS', name: 'compassUI', title: 'Feel the pull.', lead: 'Hold your phone flat and watch the page move toward magnetic north.', instructions: 'Hold your phone flat, screen up, in portrait orientation and enable the experience. Rotate your phone and watch the page shift toward magnetic north. On iPhone, allow motion and orientation access.', note: 'Sensor support varies by device and browser. Magnetic interference and tilting the phone can affect direction.', icon: '◎', cards: ['Find your direction', 'Explore', 'Discover'], detail: 'Follow magnetic north.' },
  '/tornado': { UI: TornadoUI, number: '003', sensor: 'MOTION', name: 'tornadoUI', title: 'Stir things up.', lead: 'Rotate your phone quickly and watch the page swirl, then settle as you stop.', instructions: 'Enable motion sensing and rotate your phone. Faster rotation makes the effect stronger.', note: 'Motion sensor support and permissions vary by device and browser. The effect respects your reduced-motion setting.', icon: '✳', cards: ['Make some motion', 'Swirl', 'Settle'], detail: 'Give your phone a turn.' },
  '/earthquake': { UI: EarthquakeUI, number: '004', sensor: 'MOTION', name: 'earthquakeUI', title: 'Shake things up.', lead: 'Shake your phone and watch the page scatter, then slowly return.', instructions: 'Enable motion sensing and shake your phone. Stronger movement makes the impact bigger; the page slowly returns after you stop.', note: 'Motion sensor support and permissions vary by device and browser. The effect respects your reduced-motion setting.', icon: '↯', cards: ['Make some motion', 'Quake', 'Recover'], detail: 'Give your phone a shake.' },
  '/pulse': { UI: PulseUI, number: '005', sensor: 'MICROPHONE', name: 'pulseUI', title: 'Feel the sound.', lead: 'Give your interface a little rhythm. Sound makes the page expand and glow.', instructions: 'Enable the microphone, then play music, speak, or clap. The page responds to loudness and settles as the room gets quieter.', note: 'Audio is processed on your device and is not recorded or sent. The microphone stops when you stop it or switch away from the page.', icon: '◉', cards: ['Find your rhythm', 'Listen', 'Glow'], detail: 'Play a song, speak, or clap.' },
  '/gravity': { UI: GravityUI, number: '006', sensor: 'ORIENTATION', name: 'gravityUI', title: 'Feel the pull.', lead: 'Tilt your phone and watch the page slide toward the lower edge.', instructions: 'Enable orientation sensing, then tilt your phone in any direction. The page moves with the tilt and returns when you hold it flat.', note: 'Orientation support and permissions vary by device and browser. The effect respects your reduced-motion setting.', icon: '↓', cards: ['Feel the pull', 'Slide', 'Settle'], detail: 'Give your phone a tilt.' }
};

function World({ UI, number, sensor, name, title, lead, instructions, note, icon, cards, detail }) {
  const { settings, props } = useDemoSettings();
  return <main className="scared-experience"><UI {...props} className="scared-world world-other">
    <Header />
    <a className="back-link world-back" href="/">← &nbsp; ALL EXPERIMENTS</a>
    <div className="eyebrow world-eyebrow"><span className="pulse" /> EXPERIMENT {number} <span className="eyebrow-index">/ {sensor}</span></div>
    <h1 className="world-title">Meet <em>{name}.</em></h1>
    <div><p className="world-lead">{lead}</p>{settings}</div>
    <section className="world-instructions"><div className="label"><span>✳</span> HOW IT WORKS</div><h2>{title}</h2><p>{instructions}</p><p className="sensor-note">{note}</p></section>
    <div className="tile tile-wide"><span className="tile-icon">{icon}</span><span className="tile-bottom"><strong>{cards[0]}</strong><small>{detail}</small></span><span className="tile-arrow">↗</span></div>
    <div className="tile tile-purple"><span className="tile-icon">✦</span><span className="tile-bottom"><strong>{cards[1]}</strong></span></div>
    <div className="tile tile-blue"><span className="tile-icon">◒</span><span className="tile-bottom"><strong>{cards[2]}</strong></span></div>
    <p className="world-end"><span className="pulse" /> YOUR DEVICE IS THE CONTROLLER</p>
    <Footer />
  </UI></main>;
}

function Gesture() {
  return <><Header /><main className="gesture-page">
    <a className="back-link" href="/#experiments">← All experiments</a>
    <h1 className="world-title">Meet <em>gestureUI.</em></h1>
    <p className="world-lead">Show an open hand and aim the dot at a card. Pinch your thumb and index finger together, move sideways, then open them to drop the card.</p>
    <p className="sensor-note">Enable the front camera to begin. Hand tracking runs on your device. Video stays in your browser and audio is off.</p>
    <GestureUI className="gesture-board" itemClassName="gesture-card">
      <div className="tile tile-purple"><strong>Daydream</strong></div>
      <div className="tile tile-blue"><strong>Discover</strong></div>
    </GestureUI>
  </main><Footer /></>;
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '');
  return <div className="app">{path === '/gesture' ? <Gesture /> : path === '/scared' ? <Scared /> : worlds[path] ? <World {...worlds[path]} /> : <><Header />{path === '/docs' ? <Docs /> : path === '' ? <Home /> : <NotFound />}<Footer /></>}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
