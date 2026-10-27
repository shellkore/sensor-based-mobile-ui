import React from 'react';
import { createRoot } from 'react-dom/client';
import { ScaredUI } from '../../src/react/index.js';
import './style.css';

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">✳</span> sensor<span>ui</span><small>LAB</small></a>
        <span className="top-note"><span className="status-dot" /> An experiment in interaction</span>
      </header>

      <main id="top">
        <section className="intro">
          <div className="eyebrow"><span>01</span> INTERACTIVE EXPERIMENT</div>
          <h1>Interfaces with <em>feelings.</em></h1>
          <p>A little exploration of what happens when your screen senses the world around it.</p>
        </section>

        <section className="experiment" aria-labelledby="scared-title">
          <div className="experiment-copy">
            <div className="label"><span>✳</span> AMBIENT LIGHT EXPERIMENT</div>
            <h2 id="scared-title">Meet scaredUI</h2>
            <p>It’s a little shy. Bring your hand close to the light sensor and watch the interface get the jitters.</p>
            <div className="steps">
              <div><span>01</span><p><strong>Find some light</strong>Keep your sensor uncovered to calibrate.</p></div>
              <div><span>02</span><p><strong>Move your hand closer</strong>A quick shadow makes a bigger reaction.</p></div>
            </div>
            <p className="sensor-note">Sensor support varies by device and browser. Changes in room light can trigger the effect too.</p>
          </div>

          <div className="demo-panel">
            <div className="panel-heading"><span>THE PLAYGROUND</span><span>● SENSOR POWERED</span></div>
            <div className="screen">
              <div className="screen-top"><span>YOUR LITTLE SPACE</span><span>✳</span></div>
              <div className="greeting">Hey there <span>✳</span></div>
              <p className="screen-subtitle">Things are looking good today.</p>
              <ScaredUI className="scared-demo">
                <div className="tile tile-wide"><span className="tile-icon">✦</span><span className="tile-bottom"><strong>A little inspiration</strong><small>Make room for good ideas.</small></span><span className="tile-arrow">↗</span></div>
                <div className="tile tile-peach"><span className="tile-icon">☼</span><span className="tile-bottom"><strong>Today</strong><small>A fresh start</small></span></div>
                <div className="tile tile-green"><span className="tile-icon">✿</span><span className="tile-bottom"><strong>Ideas</strong><small>Let them grow</small></span></div>
              </ScaredUI>
              <div className="screen-footer"><span>MADE TO MOVE</span><span>✳ ✳ ✳</span></div>
            </div>
            <p className="panel-hint">A tiny reminder: be gentle with your screen.</p>
          </div>
        </section>
      </main>
      <footer><span>✳ &nbsp; SENSOR UI LAB</span><span>Curious by design.</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
