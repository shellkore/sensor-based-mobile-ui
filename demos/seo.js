const pages = {
  '/': {
    title: 'Sensor UI Lab | Interfaces that feel',
    description: 'Explore interactive UI experiments that respond to light, compass direction, and motion on your phone.'
  },
  '/scared': {
    title: 'scaredUI | Sensor UI Lab',
    description: 'Try scaredUI: an interface that shivers in response to shadows, using your phone’s ambient light sensor or front camera.'
  },
  '/compass': {
    title: 'compassUI | Sensor UI Lab',
    description: 'Explore compassUI, an interface that moves toward magnetic north using your phone’s compass and orientation sensors.'
  },
  '/tornado': {
    title: 'tornadoUI | Sensor UI Lab',
    description: 'Try tornadoUI: rotate your phone to make interface elements swirl, then watch them settle when you stop.'
  },
  '/earthquake': {
    title: 'earthquakeUI | Sensor UI Lab',
    description: 'Try earthquakeUI: shake your phone to scatter interface elements and watch them slowly return.'
  },
  '/gravity': {
    title: 'gravityUI | Sensor UI Lab',
    description: 'Try gravityUI: tilt your phone to slide cards toward the lower edge.'
  },
  '/docs': {
    title: 'Documentation | Sensor UI Lab',
    description: 'Learn how to use sensor-responsive React and Next.js components from the Sensor UI Lab library.'
  },
  '/404': {
    title: 'Page not found | Sensor UI Lab',
    description: 'This page could not be found. Explore the Sensor UI Lab collection instead.'
  }
};

export const pagePaths = Object.keys(pages).filter(path => path !== '/404');

const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function seoTags(path, siteUrl) {
  const canonicalPath = pages[path] ? path : '/404';
  const page = pages[canonicalPath];
  const origin = new URL(siteUrl).origin;
  const url = new URL(canonicalPath, origin).href;
  const image = new URL('/og-image.png', origin).href;
  return `<!-- seo:start -->
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}" />
    ${canonicalPath === '/404' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${escape(url)}" />`}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Sensor UI Lab" />
    <meta property="og:title" content="${escape(page.title)}" />
    <meta property="og:description" content="${escape(page.description)}" />
    <meta property="og:url" content="${escape(url)}" />
    <meta property="og:image" content="${escape(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Sensor UI Lab: interfaces that feel" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(page.title)}" />
    <meta name="twitter:description" content="${escape(page.description)}" />
    <meta name="twitter:image" content="${escape(image)}" />
    <!-- seo:end -->`;
}
