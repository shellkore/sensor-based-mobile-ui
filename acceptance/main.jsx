import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ScaredUI, CompassUI, TornadoUI, EarthquakeUI, PulseUI, GravityUI } from 'sensor-based-mobile-ui';

const components = { ScaredUI, CompassUI, TornadoUI, EarthquakeUI, PulseUI, GravityUI };
const intensities = { default: undefined, zero: 0, half: 0.5, normal: 1, double: 2, negative: -1, excessive: 10, invalid: NaN, infinite: Infinity, string: '1' };

function App() {
  const [name, setName] = useState('GravityUI');
  const [intensity, setIntensity] = useState('default');
  const [mounted, setMounted] = useState(true);
  const Component = components[name];
  return <main>
    <h1>Library acceptance app</h1>
    <label>Component <select value={name} onChange={event => setName(event.target.value)}>
      {Object.keys(components).map(value => <option key={value}>{value}</option>)}
    </select></label>
    <label>Intensity <select value={intensity} onChange={event => setIntensity(event.target.value)}>
      {Object.keys(intensities).map(value => <option key={value}>{value}</option>)}
    </select></label>
    <button onClick={() => setMounted(value => !value)}>{mounted ? 'Unmount' : 'Mount'}</button>
    {mounted && <Component key={name} intensity={intensities[intensity]}>
      <button data-testid="card">First card</button>
      <button>Second card</button>
    </Component>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
