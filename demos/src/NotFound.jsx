import React from 'react';

export default function NotFound() {
  return <main className="not-found">
    <div className="not-found-copy">
      <div className="eyebrow"><span className="pulse" /> SIGNAL LOST <span className="eyebrow-index">/ ERROR 404</span></div>
      <h1>Looks like<br />we <em>drifted.</em></h1>
      <p>This page is out of range. Head back to the lab and find something worth exploring.</p>
      <a className="button button-primary" href="/">Back to the lab <span>↗</span></a>
      <a className="not-found-docs" href="/docs">Looking for the docs? →</a>
    </div>
    <div className="not-found-art" aria-hidden="true"><div className="not-found-orbit orbit-one" /><div className="not-found-orbit orbit-two" /><span className="not-found-number">4<span>✳</span>4</span><span className="not-found-label">NO SIGNAL FOUND <span>✳</span></span></div>
  </main>;
}
