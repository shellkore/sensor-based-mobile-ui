'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createScaredState, frameBrightness, readLight, scaredMotion } from '../core/scared.js';
import { createMagneticState, readMagneticField, readMagneticHeading, magneticMotion } from '../core/magnetic.js';

export function ScaredUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [session, setSession] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const elements = useRef([]);
  const video = useRef(null);
  const cameraRef = useRef(null);
  const cameraRequest = useRef(0);
  const cameraState = useRef(createScaredState());

  useEffect(() => () => { cameraRequest.current++; cameraRef.current?.getTracks().forEach(track => track.stop()); }, []);

  const stopCamera = () => {
    cameraRequest.current++;
    cameraRef.current?.getTracks().forEach(track => track.stop());
    cameraRef.current = null;
    if (video.current) video.current.srcObject = null;
    setCameraStream(null);
    setStatus('stopped');
  };

  const startCamera = async () => {
    const request = ++cameraRequest.current;
    setSensorEnabled(false);
    setStatus('camera-pending');
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('camera-unavailable'); return; }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (request !== cameraRequest.current) { stream.getTracks().forEach(track => track.stop()); return; }
      if (document.hidden) { stream.getTracks().forEach(track => track.stop()); stopCamera(); return; }
      cameraRef.current = stream;
      video.current.srcObject = stream;
      await video.current.play();
      if (request !== cameraRequest.current) { stream.getTracks().forEach(track => track.stop()); return; }
      if (document.hidden) { stopCamera(); return; }
      cameraState.current = createScaredState();
      setStatus('camera-starting');
      setCameraStream(stream);
    } catch {
      stream?.getTracks().forEach(track => track.stop());
      if (request === cameraRequest.current) { cameraRef.current = null; if (video.current) video.current.srcObject = null; setStatus('camera-unavailable'); }
    }
  };

  useEffect(() => {
    if (!cameraStream) return;
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 24;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    let lastSample = 0;
    const onHidden = () => { if (document.hidden) stopCamera(); };
    const onEnded = () => { stopCamera(); setStatus('camera-unavailable'); };
    document.addEventListener('visibilitychange', onHidden);
    cameraStream.getVideoTracks().forEach(track => track.addEventListener('ended', onEnded));
    const animate = () => {
      const now = Date.now();
      if (now - lastSample >= 100 && video.current?.readyState >= 2) {
        try {
          context.drawImage(video.current, 0, 0, canvas.width, canvas.height);
          // shortcut: camera auto-exposure can mask a shadow; use calibrated vision if brightness proves unreliable.
          cameraState.current = readLight(cameraState.current, frameBrightness(context.getImageData(0, 0, canvas.width, canvas.height).data), now);
          setStatus(cameraState.current.baseline < 1 ? 'camera-dark' : 'camera-active');
          lastSample = now;
        } catch { stopCamera(); setStatus('camera-unavailable'); return; }
      }
      elements.current.forEach((element, index) => {
        if (!element) return;
        const { x, y, rotate } = reducedMotion.matches ? { x: 0, y: 0, rotate: 0 } : scaredMotion(cameraState.current, now, index);
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      cameraStream.getVideoTracks().forEach(track => track.removeEventListener('ended', onEnded));
      cameraStream.getTracks().forEach(track => track.stop());
      if (cameraRef.current === cameraStream) cameraRef.current = null;
      if (video.current) video.current.srcObject = null;
      cancelAnimationFrame(frame);
      elements.current.forEach(element => { if (element) element.style.transform = ''; });
    };
  }, [cameraStream]);

  useEffect(() => {
    if (!session || !sensorEnabled) return;
    if (!window.isSecureContext) {
      setStatus('insecure');
      return;
    }
    if (!('AmbientLightSensor' in window)) {
      setStatus('unsupported');
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
  }, [session, sensorEnabled]);

  return React.createElement('div', { className },
    cameraStream
      ? React.createElement(React.Fragment, null,
        React.createElement('button', { type: 'button', onClick: () => { cameraState.current = createScaredState(); setStatus('camera-starting'); } }, 'Recalibrate scaredUI'),
        React.createElement('button', { type: 'button', onClick: stopCamera }, 'Stop camera'))
      : status === 'camera-pending'
        ? React.createElement('button', { type: 'button', onClick: stopCamera }, 'Cancel camera request')
        : React.createElement('button', { type: 'button', onClick: () => { setSensorEnabled(true); setStatus('starting'); setSession(value => value + 1); } }, status === 'active' || status === 'dark' ? 'Recalibrate scaredUI' : session ? 'Try light sensor again' : 'Enable scaredUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Uncover the light sensor, then enable scaredUI.',
      starting: 'Keep the light sensor uncovered while calibrating. You can choose the camera if no reading arrives.',
      active: 'Cover the light sensor to make the interface shiver.',
      dark: 'There is not enough light to calibrate. Move somewhere brighter and recalibrate.',
      insecure: 'Ambient light sensing requires HTTPS or localhost.',
      unsupported: 'This browser does not provide ambient light sensing. You can choose the camera instead.',
      unavailable: 'Ambient light sensing is unavailable or permission was denied. You can choose the camera instead.',
      'camera-pending': 'Waiting for camera permission. No microphone is used.',
      'camera-starting': 'Keep the front camera uncovered while calibrating.',
      'camera-active': 'Camera active. Move your hand over the front camera to make the interface shiver.',
      'camera-dark': 'The camera view is too dark. Uncover the camera and recalibrate in brighter light.',
      'camera-unavailable': 'Camera access is unavailable or permission was denied. Check your browser settings and try again.',
      stopped: 'Camera stopped. You can restart it whenever you are ready.'
    }[status]),
    ['starting', 'unsupported', 'unavailable', 'camera-unavailable', 'stopped'].includes(status) && React.createElement(React.Fragment, null,
      React.createElement('p', null, 'Use the front camera to estimate light changes. Video is processed on your device and is not saved or sent anywhere.'),
      React.createElement('button', { type: 'button', onClick: startCamera }, 'Use front camera')),
    React.createElement('video', { ref: video, autoPlay: true, muted: true, playsInline: true, 'aria-hidden': true, tabIndex: -1, style: { position: 'fixed', width: 1, height: 1, opacity: 0.01, pointerEvents: 'none', bottom: 0, left: 0 } }),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block' }
    }, child))
  );
}

export function CompassUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [session, setSession] = useState(0);
  const [source, setSource] = useState(null);
  const elements = useRef([]);
  const request = useRef(0);

  useEffect(() => () => { request.current++; }, []);

  const enable = async () => {
    const current = ++request.current;
    if (!window.isSecureContext) { setStatus('insecure'); return; }
    if ('Magnetometer' in window) {
      setSource('magnetometer');
    } else if (window.DeviceOrientationEvent) {
      setStatus('permission');
      try {
        if (typeof window.DeviceOrientationEvent.requestPermission === 'function' &&
            await window.DeviceOrientationEvent.requestPermission(true) !== 'granted') {
          if (current === request.current) setStatus('denied');
          return;
        }
      } catch {
        if (current === request.current) setStatus('denied');
        return;
      }
      if (current !== request.current) return;
      setSource('compass');
    } else {
      setStatus('unsupported');
      return;
    }
    setStatus('starting');
    setSession(value => value + 1);
  };

  useEffect(() => {
    if (!session || !source) return;

    let sensor;
    let frame;
    let state = createMagneticState();
    let timeout = setTimeout(() => setStatus('unavailable'), 8000);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reset = () => elements.current.forEach(element => {
      if (element) element.style.transform = '';
    });
    const animate = () => {
      const { x, y } = reducedMotion.matches ? { x: 0, y: 0 } : magneticMotion(state);
      elements.current.forEach(element => {
        if (element) element.style.transform = `translate(${x}px, ${y}px)`;
      });
      frame = requestAnimationFrame(animate);
    };
    const onOrientation = event => {
      state = readMagneticHeading(state, event.webkitCompassHeading);
      if (state.baseline) { clearTimeout(timeout); setStatus('compass-active'); }
    };
    try {
      if (source === 'compass') {
        window.addEventListener('deviceorientation', onOrientation);
      } else {
        sensor = new window.Magnetometer({ frequency: 10 });
        sensor.addEventListener('reading', () => {
          state = readMagneticField(state, sensor.x, sensor.y);
          if (state.baseline) { clearTimeout(timeout); setStatus('active'); }
        });
        sensor.addEventListener('error', () => {
          sensor.stop();
          clearTimeout(timeout);
          cancelAnimationFrame(frame);
          reset();
          setStatus('unavailable');
        });
        sensor.start();
      }
      frame = requestAnimationFrame(animate);
    } catch {
      sensor?.stop();
      clearTimeout(timeout);
      reset();
      setStatus('unavailable');
    }
    return () => {
      sensor?.stop();
      window.removeEventListener('deviceorientation', onOrientation);
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [session, source]);

  return React.createElement('div', { className },
    React.createElement('button', { type: 'button', onClick: enable, disabled: status === 'permission' }, session ? 'Recalibrate compassUI' : 'Enable compassUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Hold your device still, then enable compassUI.',
      permission: 'Waiting for motion and orientation permission.',
      starting: 'Keep your device still while calibrating.',
      active: 'Move or rotate your device to change the magnetic field.',
      'compass-active': 'Rotate your device to change its compass heading.',
      insecure: 'Magnetic sensing requires HTTPS or localhost.',
      unsupported: 'This browser does not provide magnetic sensing or a compass heading.',
      denied: 'Motion and orientation access was denied. Check your browser settings and try again.',
      unavailable: 'No magnetic reading was received. Check your device and browser settings, then try again.'
    }[status]),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block' }
    }, child))
  );
}

export { CompassUI as MagneticUI };
