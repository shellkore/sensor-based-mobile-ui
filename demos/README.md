# Sensor UI demos

This React/Vite app lists the project's web demos on `/`. The `/scared` demo uses the real `ScaredUI` component from `../src`.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
cd demos
npm install
npm run dev
```

Open the local URL Vite prints. Ambient light access requires a supported browser and device in a secure context. `localhost` works for local testing on the same device; use the HTTPS deployment to test on a phone. Keep the sensor uncovered while enabling or recalibrating. Browsers without sensor access display a message and keep the content usable.

## Deploy to Vercel

Connect the repository and set **Root Directory** to `demos`. Choose the Vite framework preset if it is not detected; the build command is `npm run build` and the output directory is `dist`. In the Root Directory settings, ensure **Include source files outside of the Root Directory in the Build Step** is enabled: this app imports the shared component from `src` in the repository root. The included `vercel.json` lets direct visits to `/scared` load the app. Commit both `demos` and `src` before deploying. No environment variables are required.
