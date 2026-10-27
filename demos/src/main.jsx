import React from 'react';
import { createRoot } from 'react-dom/client';
import { ScaredUI, MagneticUI } from '../../src/react/index.js';
import './style.css';

function scrollToExperiments(event) {
  const section = document.getElementById('experiments');
  if (section) {
    event.preventDefault();
    section.scrollIntoView();
  }
}

function Header() {
  return <header className="header"><a className="brand" href="/" aria-label="Sensor UI Lab home"><span className="brand-icon">✳</span><span>SENSOR<span className="brand-accent">/</span>UI<small>INTERACTION LAB</small></span></a><nav aria-label="Main navigation"><a href="/#experiments" onClick={scrollToExperiments}>Experiments</a><a className="nav-link" href="/#experiments" onClick={scrollToExperiments}>Enter the lab <span>↗</span></a></nav></header>;
}

function Footer() {
  return <footer className="footer"><span>✳ &nbsp; SENSOR/UI LAB</span><span>DESIGNED TO FEEL SOMETHING <i>✳</i></span></footer>;
}

function Home() {
  React.useEffect(() => {
    if (window.location.hash === '#experiments') {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      document.getElementById('experiments')?.scrollIntoView();
    }
  }, []);

  return <><main><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="pulse" /> A NEW KIND OF INTERFACE <span className="eyebrow-index">/ 001</span></div><h1>Interfaces<br />that <em>feel.</em></h1><p>What if your screen could sense the world around it? Explore a collection of interfaces that respond to you, in real time.</p><a className="button button-primary" href="#experiments" onClick={scrollToExperiments}>Explore experiments <span>↘</span></a><div className="hero-caption"><span>✳</span> A LITTLE LESS STATIC.<br />&nbsp;&nbsp;&nbsp;&nbsp; A LOT MORE ALIVE.</div></div><div className="hero-art" aria-hidden="true"><div className="art-label art-label-top">SENSOR INPUT <span>● ACTIVE</span></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orb"><div className="orb-core">✳</div></div><div className="art-cross cross-one">+</div><div className="art-cross cross-two">+</div><div className="art-label art-label-bottom"><span>RESPONSIVE BY NATURE</span><span>02 / 02</span></div></div></section>
    <section className="gallery" id="experiments"><div className="section-head"><div><div className="eyebrow"><span className="dash" /> THE COLLECTION</div><h2>Pick your <em>experience.</em></h2></div><p>A growing collection of small experiments in human-device interaction.</p></div><a className="experiment-card" href="/scared"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">✳</div><span className="visual-index">EXPERIMENT / 001</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>01 / AMBIENT LIGHT</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>scaredUI<span>↗</span></h3><p>An interface that gets the jitters when you get a little too close.</p><div className="card-footer"><span>LIGHT-RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><a className="experiment-card magnetic-card" href="/magnetic"><div className="card-visual" aria-hidden="true"><div className="card-grid" /><div className="card-orb">◎</div><span className="visual-index">EXPERIMENT / 002</span><span className="visual-symbol">↗</span></div><div className="card-content"><div className="card-meta"><span>02 / MAGNETOMETER</span><span className="available"><span /> AVAILABLE NOW</span></div><h3>magneticUI<span>↗</span></h3><p>An interface that moves with the magnetic field around your device.</p><div className="card-footer"><span>MAGNETIC-FIELD RESPONSIVE</span><span>EXPLORE EXPERIENCE &nbsp; →</span></div></div></a><div className="collection-end"><span>MORE EXPERIMENTS IN THE MAKING</span><span>✳</span></div></section></main></>;
}

function Scared() {
  return <main className="scared-page"><a className="back-link" href="/">← &nbsp; ALL EXPERIMENTS</a><section className="scared-intro"><div><div className="eyebrow"><span className="pulse" /> EXPERIMENT 001 <span className="eyebrow-index">/ AMBIENT LIGHT</span></div><h1>Meet <em>scaredUI.</em></h1><p>It’s a little shy. Bring your hand near your light sensor or front camera and watch the interface come to life.</p></div><div className="intro-number" aria-hidden="true">01<span>✳</span></div></section><section className="lab"><div className="lab-copy"><div className="label"><span>✳</span> HOW IT WORKS</div><h2>Make it<br /><em>nervous.</em></h2><p>A shadow over the light sensor or front camera makes the elements shiver. Move quickly and they’ll scatter a little further.</p><div className="steps"><div><span>01</span><p><strong>Find some light</strong>Keep the sensor or camera uncovered while you enable the experience.</p></div><div><span>02</span><p><strong>Make your move</strong>Cover the sensor or front camera with your hand, then move it away.</p></div></div><p className="sensor-note">If the light sensor is unavailable, you can choose the front camera. Changing light or camera exposure can affect the response.</p></div><div className="demo-panel"><div className="panel-heading"><span>LIVE PLAYGROUND <i>✳</i></span><span>001 / SCARED UI</span></div><div className="screen"><div className="screen-top"><span>YOUR LITTLE SPACE</span><span>✳</span></div><div className="greeting">Hello, human<span>✳</span></div><p className="screen-subtitle">A little space with a life of its own.</p><ScaredUI className="scared-demo"><div className="tile tile-wide"><span className="tile-icon">✳</span><span className="tile-bottom"><strong>Make some magic</strong><small>A little inspiration for today.</small></span><span className="tile-arrow">↗</span></div><div className="tile tile-purple"><span className="tile-icon">✦</span><span className="tile-bottom"><strong>Daydream</strong><small>Let your mind wander</small></span></div><div className="tile tile-blue"><span className="tile-icon">◒</span><span className="tile-bottom"><strong>Discover</strong><small>See what’s out there</small></span></div></ScaredUI><div className="screen-footer"><span>MADE TO MOVE</span><span>✳ &nbsp; ✳ &nbsp; ✳</span></div></div><p className="panel-hint"><span className="pulse" /> YOUR DEVICE IS THE CONTROLLER</p></div></section></main>;
}

function Magnetic() {
  return <main className="scared-page"><a className="back-link" href="/">← &nbsp; ALL EXPERIMENTS</a><section className="scared-intro"><div><div className="eyebrow"><span className="pulse" /> EXPERIMENT 002 <span className="eyebrow-index">/ MAGNETOMETER</span></div><h1>Meet <em>magneticUI.</em></h1><p>A little movement can change everything. Let your device sense the magnetic field around it.</p></div><div className="intro-number" aria-hidden="true">02<span>✳</span></div></section><section className="lab"><div className="lab-copy"><div className="label"><span>✳</span> HOW IT WORKS</div><h2>Feel the<br /><em>pull.</em></h2><p>Rotate your device to move the elements. On iPhone, allow motion and orientation access to use its compass heading.</p><div className="steps"><div><span>01</span><p><strong>Find your starting point</strong>Hold your device still while you enable the experience.</p></div><div><span>02</span><p><strong>Make your move</strong>Rotate your device and watch the elements respond.</p></div></div><p className="sensor-note">Sensor support varies by device and browser. The compass fallback responds to heading changes, not magnetic field strength.</p></div><div className="demo-panel"><div className="panel-heading"><span>LIVE PLAYGROUND <i>✳</i></span><span>002 / MAGNETIC UI</span></div><div className="screen"><div className="screen-top"><span>YOUR LITTLE SPACE</span><span>✳</span></div><div className="greeting">Hello, human<span>✳</span></div><p className="screen-subtitle">A little space with a pull of its own.</p><MagneticUI className="scared-demo"><div className="tile tile-wide"><span className="tile-icon">◎</span><span className="tile-bottom"><strong>Find your direction</strong><small>See where the field takes you.</small></span><span className="tile-arrow">↗</span></div><div className="tile tile-purple"><span className="tile-icon">✦</span><span className="tile-bottom"><strong>Explore</strong><small>Follow the pull</small></span></div><div className="tile tile-blue"><span className="tile-icon">◒</span><span className="tile-bottom"><strong>Discover</strong><small>Find something new</small></span></div></MagneticUI><div className="screen-footer"><span>MADE TO MOVE</span><span>✳ &nbsp; ✳ &nbsp; ✳</span></div></div><p className="panel-hint"><span className="pulse" /> YOUR DEVICE IS THE CONTROLLER</p></div></section></main>;
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '');
  return <div className="app"><Header />{path === '/scared' ? <Scared /> : path === '/magnetic' ? <Magnetic /> : <Home />}<Footer /></div>;
}

createRoot(document.getElementById('root')).render(<App />);
