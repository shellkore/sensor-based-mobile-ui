'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createScaredState, readLight, scaredMotion } from '../core/scared.js';

export function ScaredUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [session, setSession] = useState(0);
  const elements = useRef([]);

  useEffect(() => {
    if (!session) return;
    if (!window.isSecureContext || !('AmbientLightSensor' in window)) {
      setStatus('unavailable');
      return;
    }

    let sensor;
    let frame;
    let state = createScaredState();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reset = () => elements.current.forEach(element => {
      if (element) element.style.transform = '';
    });
    const animate = () => {
      elements.current.forEach((element, index) => {
        if (!element) return;
        const { x, y, rotate } = reducedMotion.matches ? { x: 0, y: 0, rotate: 0 } : scaredMotion(state, Date.now(), index);
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      });
      frame = requestAnimationFrame(animate);
    };
    try {
      sensor = new window.AmbientLightSensor({ frequency: 10 });
      sensor.addEventListener('reading', () => {
        state = readLight(state, sensor.illuminance, Date.now());
        if (state.baseline !== null) setStatus(state.baseline < 1 ? 'dark' : 'active');
      });
      sensor.addEventListener('error', () => {
        sensor.stop();
        cancelAnimationFrame(frame);
        reset();
        setStatus('unavailable');
      });
      sensor.start();
      frame = requestAnimationFrame(animate);
    } catch {
      sensor?.stop();
      reset();
      setStatus('unavailable');
    }
    return () => {
      sensor?.stop();
      cancelAnimationFrame(frame);
      reset();
    };
  }, [session]);

  return React.createElement('div', { className },
    React.createElement('button', { type: 'button', onClick: () => { setStatus('starting'); setSession(value => value + 1); } }, session ? 'Recalibrate scaredUI' : 'Enable scaredUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Uncover the light sensor, then enable scaredUI.',
      starting: 'Keep the light sensor uncovered while calibrating.',
      active: 'Cover the light sensor to make the interface shiver.',
      dark: 'There is not enough light to calibrate. Move somewhere brighter and recalibrate.',
      unavailable: 'Ambient light sensing is unavailable or permission was denied.'
    }[status]),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block' }
    }, child))
  );
}
