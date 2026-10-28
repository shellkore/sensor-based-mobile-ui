'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createScaredState, frameBrightness, readLight, scaredMotion } from '../core/scared.js';
import { createMagneticState, readMagneticField, readMagneticHeading, magneticMotion } from '../core/magnetic.js';
import { readRotation, tornadoMotion } from '../core/tornado.js';
import { readEarthquake, earthquakeMotion } from '../core/earthquake.js';
import { readLoudness } from '../core/pulse.js';
import { gravityMotion } from '../core/gravity.js';

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
        const { x, y, rotate, scaleY } = reducedMotion.matches ? { x: 0, y: 0, rotate: 0, scaleY: 1 } : scaredMotion(cameraState.current, now, index);
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scaleY(${scaleY})`;
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
        const { x, y, rotate, scaleY } = reducedMotion.matches ? { x: 0, y: 0, rotate: 0, scaleY: 1 } : scaredMotion(state, Date.now(), index);
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scaleY(${scaleY})`;
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
      if (state.field) { clearTimeout(timeout); setStatus('compass-active'); }
    };
    try {
      if (source === 'compass') {
        window.addEventListener('deviceorientation', onOrientation);
      } else {
        sensor = new window.Magnetometer({ frequency: 10, referenceFrame: 'screen' });
        sensor.addEventListener('reading', () => {
          state = readMagneticField(state, sensor.x, sensor.y);
          if (state.field) { clearTimeout(timeout); setStatus('active'); }
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
    React.createElement('button', { type: 'button', onClick: enable, disabled: status === 'permission' }, session ? 'Restart compassUI' : 'Enable compassUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Hold your phone flat in portrait, then enable compassUI.',
      permission: 'Waiting for motion and orientation permission.',
      starting: 'Waiting for a compass reading.',
      active: 'Hold your phone flat and rotate it. The content shifts toward magnetic north.',
      'compass-active': 'Hold your phone flat and rotate it. The content shifts toward magnetic north.',
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

export function TornadoUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [session, setSession] = useState(0);
  const elements = useRef([]);
  const request = useRef(0);

  useEffect(() => () => { request.current++; }, []);

  const enable = async () => {
    const current = ++request.current;
    if (!window.isSecureContext) { setStatus('insecure'); return; }
    if (!window.DeviceMotionEvent) { setStatus('unsupported'); return; }
    setStatus('permission');
    try {
      if (typeof window.DeviceMotionEvent.requestPermission === 'function' &&
          await window.DeviceMotionEvent.requestPermission() !== 'granted') {
        if (current === request.current) setStatus('denied');
        return;
      }
    } catch {
      if (current === request.current) setStatus('denied');
      return;
    }
    if (current !== request.current) return;
    setStatus('starting');
    setSession(value => value + 1);
  };

  useEffect(() => {
    if (!session) return;
    let state = null;
    let frame;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timeout = setTimeout(() => setStatus('unavailable'), 8000);
    const onMotion = event => {
      const reading = readRotation(event.rotationRate, Date.now(), state);
      if (!reading) return;
      state = reading;
      clearTimeout(timeout);
      setStatus('active');
    };
    const animate = () => {
      const items = elements.current.filter(Boolean);
      const left = Math.min(...items.map(element => element.offsetLeft));
      const right = Math.max(...items.map(element => element.offsetLeft + element.offsetWidth));
      const top = Math.min(...items.map(element => element.offsetTop));
      const bottom = Math.max(...items.map(element => element.offsetTop + element.offsetHeight));
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      items.forEach(element => {
        if (!element) return;
        const { x, y } = reducedMotion.matches ? { x: 0, y: 0 } : tornadoMotion(state, Date.now(), element.offsetLeft + element.offsetWidth / 2 - centerX, element.offsetTop + element.offsetHeight / 2 - centerY);
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
      frame = requestAnimationFrame(animate);
    };
    window.addEventListener('devicemotion', onMotion);
    frame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('devicemotion', onMotion);
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      elements.current.forEach(element => { if (element) element.style.transform = ''; });
    };
  }, [session]);

  return React.createElement('div', { className, style: { position: 'relative' } },
    React.createElement('button', { type: 'button', disabled: status === 'permission' || status === 'active' || status === 'starting', onClick: enable }, status === 'active' ? 'TornadoUI enabled' : session ? 'Try tornadoUI again' : 'Enable tornadoUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Enable tornadoUI, then rotate your device quickly.',
      permission: 'Waiting for motion permission.',
      starting: 'Waiting for a motion sensor reading.',
      active: 'Rotate your device quickly to stir up the interface.',
      insecure: 'Motion sensing requires HTTPS or localhost.',
      unsupported: 'This browser does not provide motion sensing.',
      denied: 'Motion access was denied. Check your browser settings and try again.',
      unavailable: 'No rotation reading was received. Check your device and browser settings.'
    }[status]),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block' }
    }, child))
  );
}

export function EarthquakeUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [session, setSession] = useState(0);
  const elements = useRef([]);
  const request = useRef(0);

  useEffect(() => () => { request.current++; }, []);

  const enable = async () => {
    const current = ++request.current;
    if (!window.isSecureContext) { setStatus('insecure'); return; }
    if (!window.DeviceMotionEvent) { setStatus('unsupported'); return; }
    setStatus('permission');
    try {
      if (typeof window.DeviceMotionEvent.requestPermission === 'function' &&
          await window.DeviceMotionEvent.requestPermission() !== 'granted') {
        if (current === request.current) setStatus('denied');
        return;
      }
    } catch {
      if (current === request.current) setStatus('denied');
      return;
    }
    if (current !== request.current) return;
    setStatus('starting');
    setSession(value => value + 1);
  };

  useEffect(() => {
    if (!session) return;
    let state = null;
    let frame;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timeout = setTimeout(() => setStatus('unavailable'), 8000);
    const onMotion = event => {
      const reading = readEarthquake(event.acceleration, Date.now(), state);
      if (!reading) return;
      state = reading;
      clearTimeout(timeout);
      setStatus('active');
    };
    const animate = () => {
      elements.current.forEach((element, index) => {
        if (!element) return;
        const { x, y, rotate } = reducedMotion.matches ? { x: 0, y: 0, rotate: 0 } : earthquakeMotion(state, Date.now(), index);
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      });
      frame = requestAnimationFrame(animate);
    };
    window.addEventListener('devicemotion', onMotion);
    frame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('devicemotion', onMotion);
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      elements.current.forEach(element => { if (element) element.style.transform = ''; });
    };
  }, [session]);

  return React.createElement('div', { className, style: { position: 'relative' } },
    React.createElement('button', { type: 'button', disabled: status === 'permission' || status === 'active' || status === 'starting', onClick: enable }, status === 'active' ? 'EarthquakeUI enabled' : session ? 'Try earthquakeUI again' : 'Enable earthquakeUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Enable earthquakeUI, then shake your phone.',
      permission: 'Waiting for motion permission.',
      starting: 'Waiting for a motion sensor reading.',
      active: 'Shake your phone to move the elements. They will slowly return when you stop.',
      insecure: 'Motion sensing requires HTTPS or localhost.',
      unsupported: 'This browser does not provide motion sensing.',
      denied: 'Motion access was denied. Check your browser settings and try again.',
      unavailable: 'No acceleration reading was received. Check your device and browser settings.'
    }[status]),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block' }
    }, child))
  );
}

export function PulseUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [stream, setStream] = useState(null);
  const elements = useRef([]);
  const request = useRef(0);
  const streamRef = useRef(null);

  const stop = () => {
    request.current++;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setStream(null);
    setStatus('stopped');
  };

  useEffect(() => {
    const onHidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      request.current++;
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const start = async () => {
    const current = ++request.current;
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) { setStatus('unavailable'); return; }
    setStatus('pending');
    try {
      const audio = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      if (current !== request.current || document.hidden) { audio.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = audio;
      setStream(audio);
      setStatus('active');
    } catch {
      if (current === request.current) setStatus('unavailable');
    }
  };

  useEffect(() => {
    if (!stream) return;
    let context;
    let frame;
    let active = true;
    const onEnded = () => { if (active) { stop(); setStatus('unavailable'); } };
    const tracks = stream.getAudioTracks();
    tracks.forEach(track => track.addEventListener('ended', onEnded));
    try {
      context = new window.AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let level = 0;
      const animate = () => {
        analyser.getFloatTimeDomainData(samples);
        level = readLoudness(samples, level);
        elements.current.forEach(element => {
          if (!element) return;
          element.style.transform = reducedMotion.matches ? '' : `scale(${1 + level * 0.08})`;
          element.style.boxShadow = `0 0 ${level * 30}px rgba(182, 245, 91, ${level * 0.7})`;
        });
        frame = requestAnimationFrame(animate);
      };
      context.resume().catch(onEnded);
      frame = requestAnimationFrame(animate);
    } catch { onEnded(); }
    return () => {
      active = false;
      tracks.forEach(track => track.removeEventListener('ended', onEnded));
      cancelAnimationFrame(frame);
      context?.close();
      stream.getTracks().forEach(track => track.stop());
      elements.current.forEach(element => { if (element) { element.style.transform = ''; element.style.boxShadow = ''; } });
    };
  }, [stream]);

  return React.createElement('div', { className },
    React.createElement('button', { type: 'button', onClick: stream || status === 'pending' ? stop : start },
      stream ? 'Stop microphone' : status === 'pending' ? 'Cancel microphone request' : 'Enable pulseUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Enable the microphone, then play music, speak, or clap.',
      pending: 'Waiting for microphone permission.',
      active: 'Microphone active. Sound makes the cards pulse.',
      stopped: 'Microphone stopped.',
      unavailable: 'Microphone access is unavailable or denied. Check your browser settings and try again.'
    }[status]),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block', borderRadius: '10px' }
    }, child))
  );
}

export function GravityUI({ children, className }) {
  const [status, setStatus] = useState('idle');
  const [session, setSession] = useState(0);
  const elements = useRef([]);
  const request = useRef(0);

  useEffect(() => () => { request.current++; }, []);

  const enable = async () => {
    const current = ++request.current;
    if (!window.isSecureContext) { setStatus('insecure'); return; }
    if (!window.DeviceOrientationEvent) { setStatus('unsupported'); return; }
    setStatus('permission');
    try {
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function' &&
          await window.DeviceOrientationEvent.requestPermission() !== 'granted') {
        if (current === request.current) setStatus('denied');
        return;
      }
    } catch {
      if (current === request.current) setStatus('denied');
      return;
    }
    if (current !== request.current) return;
    setStatus('starting');
    setSession(value => value + 1);
  };

  useEffect(() => {
    if (!session) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timeout = setTimeout(() => setStatus('unavailable'), 8000);
    const onOrientation = event => {
      const motion = gravityMotion(event.beta, event.gamma, window.screen.orientation?.angle ?? window.orientation ?? 0);
      if (!motion) return;
      clearTimeout(timeout);
      setStatus('active');
      elements.current.forEach(element => {
        if (element) element.style.transform = reducedMotion.matches ? '' : `translate(${motion.x}px, ${motion.y}px)`;
      });
    };
    const onReducedMotion = () => {
      elements.current.forEach(element => {
        if (!element) return;
        element.style.transition = reducedMotion.matches ? 'none' : 'transform 0.2s ease-out';
        if (reducedMotion.matches) element.style.transform = '';
      });
    };
    onReducedMotion();
    window.addEventListener('deviceorientation', onOrientation);
    reducedMotion.addEventListener('change', onReducedMotion);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      reducedMotion.removeEventListener('change', onReducedMotion);
      clearTimeout(timeout);
      elements.current.forEach(element => { if (element) element.style.transform = ''; });
    };
  }, [session]);

  return React.createElement('div', { className },
    React.createElement('button', { type: 'button', onClick: enable, disabled: ['permission', 'starting', 'active'].includes(status) }, status === 'active' ? 'GravityUI enabled' : session ? 'Try gravityUI again' : 'Enable gravityUI'),
    React.createElement('p', { role: 'status' }, {
      idle: 'Enable gravityUI, then tilt your phone.',
      permission: 'Waiting for orientation permission.',
      starting: 'Waiting for an orientation reading.',
      active: 'Tilt your phone to move the cards toward the lower edge.',
      insecure: 'Orientation sensing requires HTTPS or localhost.',
      unsupported: 'This browser does not provide device orientation.',
      denied: 'Orientation access was denied. Check your browser settings and try again.',
      unavailable: 'No orientation reading was received. Check your device and browser settings, then try again.'
    }[status]),
    React.Children.map(children, (child, index) => React.createElement('div', {
      ref: element => { elements.current[index] = element; },
      style: { display: 'inline-block', transition: 'transform 0.2s ease-out' }
    }, child))
  );
}
