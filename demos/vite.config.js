import { defineConfig } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pagePaths, seoTags } from './seo.js';

const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) || 'https://sensor-based-mobile-ui.vercel.app';

function pageMetadata() {
  let outDir;
  let isBuild;
  return {
    name: 'page-metadata',
    configResolved(config) { outDir = resolve(config.root, config.build.outDir); isBuild = config.command === 'build'; },
    transformIndexHtml(html, context) {
      const requestPath = new URL(context.originalUrl || context.path, 'http://localhost').pathname;
      const path = requestPath === '/index.html' ? '/' : requestPath.replace(/\/$/, '') || '/';
      return html.replace('<!-- seo -->', seoTags(path, siteUrl));
    },
    async closeBundle() {
      if (!isBuild) return;
      const home = await readFile(resolve(outDir, 'index.html'), 'utf8');
      const folder = resolve(outDir, 'seo');
      await mkdir(folder, { recursive: true });
      for (const path of pagePaths.slice(1)) {
        const html = home.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, seoTags(path, siteUrl));
        await writeFile(resolve(folder, `${path.slice(1)}.html`), html);
      }
      await writeFile(resolve(outDir, '404.html'), home.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, seoTags('/404', siteUrl)));
    }
  };
}

export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom'] },
  plugins: [pageMetadata()]
});
