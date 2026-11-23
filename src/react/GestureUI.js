'use client';

import React, { useEffect, useRef, useState } from 'react';
import { readPinch, dragOffset } from '../core/gesture.js';

const runtime = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304';
const model = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const messages = {
  idle: 'Camera off.', loading: 'Starting hand tracking…', searching: 'Show an open hand to the camera.',
  ready: 'Aim at a card and pinch.', grabbed: 'Card grabbed. Open your fingers to drop it.',
  denied: 'Camera permission was denied. Allow camera access to try again.',
  unavailable: 'Hand tracking could not start. Check camera access and your connection, then retry.'
};
const h = React.createElement;

export function GestureUI({ children, className, itemClassName, itemStyle, renderControls }) {
  const [status, setStatus] = useState('idle');
  const session = useRef(null);
  const stage = useRef(null);
  const cursor = useRef(null);
  const offsets = useRef(new WeakMap());

  function stop(next = 'idle') {
    const active = session.current;
    session.current = null;
    if (active) {
      cancelAnimationFrame(active.frame);
      active.stream?.getTracks().forEach(track => track.stop());
      active.video.srcObject = null;
      active.tracker?.close();
    }
    if (cursor.current) cursor.current.hidden = true;
    setStatus(next);
  }

  useEffect(() => {
    const onHidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      stop();
    };
  }, []);

  async function enable() {
    if (session.current) return;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    const active = { video };
    session.current = active;
    setStatus('loading');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user' } });
      if (session.current !== active) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      active.stream = stream;
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        if (session.current === active) stop('unavailable');
      }, { once: true });
      video.srcObject = stream;
      await video.play();
      if (session.current !== active) return;
      const moduleUrl = runtime + '/vision_bundle.mjs';
      const { FilesetResolver, HandLandmarker } = await import(/* webpackIgnore: true */ /* @vite-ignore */ moduleUrl);
      const files = await FilesetResolver.forVisionTasks(runtime + '/wasm');
      if (session.current !== active) return;
      const tracker = await HandLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: model }, runningMode: 'VIDEO', numHands: 1
      });
      if (session.current !== active) { tracker.close(); return; }
      active.tracker = tracker;
      setStatus('searching');
      let previousTime = -1, previousFrame = -100;
      let pinched = false, armed = false, grab = null;

      function sample(now) {
        const hand = tracker.detectForVideo(video, now).landmarks[0];
        const point = readPinch(hand, video.videoWidth / video.videoHeight, pinched);
        cursor.current.hidden = !point;
        if (!point) {
          armed = false;
          pinched = false;
          grab = null;
          setStatus('searching');
          return;
        }
        const board = stage.current.getBoundingClientRect();
        const x = board.left + board.width * point.x;
        const y = board.top + board.height * point.y;
        cursor.current.style.left = point.x * 100 + '%';
        cursor.current.style.top = point.y * 100 + '%';
        if (!point.closed) {
          armed = true;
          grab = null;
        } else if (armed && !pinched) {
          // Later siblings paint on top when dropped cards overlap.
          for (const card of Array.from(stage.current.children).reverse()) {
            if (card === cursor.current) continue;
            const rect = card.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
              grab = { card, x, offset: offsets.current.get(card) || 0,
                left: rect.left - board.left, right: board.right - rect.right };
              break;
            }
          }
        }
        pinched = point.closed;
        if (grab) {
          const offset = dragOffset(grab.offset, x - grab.x, grab.left, grab.right);
          grab.card.style.translate = offset + 'px 0';
          offsets.current.set(grab.card, offset);
        }
        setStatus(grab ? 'grabbed' : armed ? 'ready' : 'searching');
      }

      function tick(now) {
        if (session.current !== active) return;
        if (video.readyState >= 2 && previousTime !== video.currentTime && now - previousFrame >= 60) {
          previousTime = video.currentTime;
          previousFrame = now;
          try { sample(now); } catch { stop('unavailable'); return; }
        }
        active.frame = requestAnimationFrame(tick);
      }
      active.frame = requestAnimationFrame(tick);
    } catch (error) {
      if (session.current === active) stop(error.name === 'NotAllowedError' ? 'denied' : 'unavailable');
    }
  }

  const disabled = ['loading', 'searching', 'ready', 'grabbed'].includes(status);
  const controls = { status, enable, stop: () => stop(), disabled };
  return h('div', { className },
    renderControls ? renderControls(controls) : h(React.Fragment, null,
      h('button', { type: 'button', onClick: disabled ? controls.stop : enable }, disabled ? 'Stop camera' : 'Enable hand tracking'),
      h('p', { role: 'status' }, messages[status])),
    h('div', { ref: stage, style: { position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', minHeight: 120 } },
      React.Children.map(children, child => child == null ? null : h('div', { className: itemClassName, style: itemStyle }, child)),
      h('span', { ref: cursor, hidden: true, 'aria-hidden': true, style: { position: 'absolute', zIndex: 1,
        pointerEvents: 'none', width: 16, height: 16, borderRadius: '50%', background: status === 'grabbed' ? '#b6f55b' : '#181923',
        border: '2px solid white', transform: 'translate(-50%, -50%)' } })));
}
