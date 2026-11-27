import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ScaredUI, CompassUI, TornadoUI, EarthquakeUI, PulseUI, GravityUI, GestureUI } from 'sensor-based-mobile-ui';

const components = { ScaredUI, CompassUI, TornadoUI, EarthquakeUI, PulseUI, GravityUI, GestureUI };
const intensities = { default: undefined, zero: 0, half: 0.5, normal: 1, double: 2, negative: -1, excessive: 10, invalid: NaN, infinite: Infinity, string: '1' };

function App() {
  const [name, setName] = useState('GravityUI');
  const [intensity, setIntensity] = useState('default');
  const [sensitivity, setSensitivity] = useState('default');
  const [customControls, setCustomControls] = useState(false);
  const [styled, setStyled] = useState(false);
  const [animateControls, setAnimateControls] = useState(false);
  const [mounted, setMounted] = useState(true);
  const Component = components[name];
  return <main>
    <h1>Library acceptance app</h1>
    <label>Component <select value={name} onChange={event => setName(event.target.value)}>
      {Object.keys(components).map(value => <option key={value}>{value}</option>)}
    </select></label>
    <label>Sensitivity <select value={sensitivity} onChange={event => setSensitivity(event.target.value)}>
      {Object.keys(intensities).map(value => <option key={value}>{value}</option>)}
    </select></label>
    <label><input type="checkbox" checked={customControls} onChange={event => setCustomControls(event.target.checked)} />Custom controls</label>
    <label><input type="checkbox" checked={styled} onChange={event => setStyled(event.target.checked)} />Styled wrappers</label>
    <label><input type="checkbox" checked={animateControls} onChange={event => setAnimateControls(event.target.checked)} />Animate scared controls</label>
    <label>Intensity <select value={intensity} onChange={event => setIntensity(event.target.value)}>
      {Object.keys(intensities).map(value => <option key={value}>{value}</option>)}
    </select></label>
    <button onClick={() => setMounted(value => !value)}>{mounted ? 'Unmount' : 'Mount'}</button>
    {mounted && <Component key={name} intensity={intensities[intensity]} sensitivity={intensities[sensitivity]}
      {...(name === 'ScaredUI' ? { animateControls, controlsAfter: animateControls ? 0 : undefined } : {})}
      itemClassName={styled ? 'consumer-item' : undefined}
      itemStyle={styled ? { display: 'block', padding: 12, borderRadius: 16, backgroundColor: 'rgb(20, 30, 40)' } : undefined}
      renderControls={customControls ? ({ status, enable, stop, disabled, startCamera, stopCamera, recalibrate }) => <div data-testid="custom-controls">
        <button disabled={disabled} onClick={enable}>Custom enable</button>
        <button onClick={stop}>Custom stop</button>
        {startCamera && <>
          <button onClick={startCamera}>Custom camera</button>
          <button onClick={stopCamera}>Custom stop camera</button>
          <button onClick={recalibrate}>Custom recalibrate</button>
        </>}
        <p role="status">{status}</p>
      </div> : undefined}>
      <button data-testid="card">First card</button>
      <button>Second card</button>
    </Component>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
