import test from 'node:test';
import assert from 'node:assert/strict';
import { pagePaths, seoTags } from './seo.js';

test('each page has its own title, description, canonical URL and social preview', () => {
  const origin = 'https://example.com';
  const titles = new Set();
  for (const path of pagePaths) {
    const html = seoTags(path, origin);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, path);
    assert.ok(!titles.has(title), `duplicate title for ${path}`);
    titles.add(title);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`));
    assert.ok(html.includes(`<meta property="og:title" content="${title}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${origin}${path}"`));
    assert.ok(html.includes(`<meta property="og:image" content="${origin}/og-image.png"`));
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  }
});

test('unknown routes are marked as not found and are not indexed', () => {
  const html = seoTags('/magnetic', 'https://example.com');
  assert.match(html, /<title>Page not found/);
  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.doesNotMatch(html, /rel="canonical"/);
});
