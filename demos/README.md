# Sensor UI demos

This React/Vite app lists the project's web demos on `/` and provides usage guidance at `/docs`. The `/scared`, `/compass`, `/tornado`, and `/earthquake` demos use the real `ScaredUI`, `CompassUI`, `TornadoUI`, and `EarthquakeUI` components from `../src`.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
cd demos
npm install
npm run dev
```

Open the local URL Vite prints. Sensor access requires a supported browser and device in a secure context. `localhost` works for local testing on the same device; use the HTTPS deployment to test on a phone. Keep the light sensor uncovered while enabling or recalibrating scaredUI, and hold the phone flat in portrait orientation when using compassUI. On iPhone, compassUI can use compass heading and asks for motion and orientation access when enabled. Browsers without sensor access display a message and keep the content usable.

For earthquakeUI, enable motion access and shake the phone. Stronger shakes move the tiles further, and they slowly return after movement stops.

For tornadoUI, enable motion access and rotate the phone quickly to make the tiles swirl. The movement settles as the phone stops.

The ambient light API used by scaredUI is not available in Safari or Chrome on iPhone. When the sensor is unavailable, choose **Use front camera**, allow camera access, and keep the camera uncovered while it calibrates. Move your hand over the camera's view to try the effect. Frames are processed locally and are not saved or sent; use **Stop camera** to stop capture. Camera exposure or scene changes may affect the response. Some Chromium browsers require an experimental flag and compatible hardware for sensor access.

## Deploy to Vercel

Connect the repository and set **Root Directory** to `demos`. Choose the Vite framework preset if it is not detected; the build command is `npm run build` and the output directory is `dist`. In the Root Directory settings, ensure **Include source files outside of the Root Directory in the Build Step** is enabled: this app imports the shared components from `src` in the repository root. The included `vercel.json` serves route-specific HTML metadata for `/scared`, `/compass`, `/tornado`, `/earthquake`, and `/docs`. Commit both `demos` and `src` before deploying.

Canonical and social-preview URLs use `SITE_URL` if set, Vercel's `VERCEL_PROJECT_PRODUCTION_URL` otherwise, or `https://sensor-based-mobile-ui.vercel.app` as a fallback. Set `SITE_URL` to the preferred public origin if using a custom domain.
