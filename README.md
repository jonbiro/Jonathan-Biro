# Jonathan Biro Portfolio

Personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion.

## Highlights

- Command palette (`Ctrl/Cmd + K`) for fast navigation and quick actions.
- Live status card with real-time Los Angeles time.
- Interactive QA Bug Hunt mini-game for engagement.
- Motion preference support (system-aware plus manual override).

## Stack

- React 19
- Vite 7
- Tailwind CSS 3
- Framer Motion
- ESLint 9

## Run Locally

```bash
npm install
npm run dev
```

## Build and Verify

```bash
npm run lint
npm run build
```

## Deploy on Netlify

1. Connect this repo in Netlify.
2. Keep the default build settings from `netlify.toml`.
3. Set `SITE_URL` in Netlify environment variables to your production domain (for example `https://biro.dev`).

Netlify will run:

```bash
VITE_SITE_URL=${SITE_URL:-$URL} npm run build
```

This ensures canonical tags, Open Graph URLs, `robots.txt`, and `sitemap.xml` are generated with the correct domain during the build.

## Deploy on GitHub Pages

1. In GitHub, open `Settings` > `Pages`.
2. Under `Build and deployment`, set `Source` to `GitHub Actions`.
3. Push to `main` (or run the `Deploy to GitHub Pages` workflow manually).

The workflow in `.github/workflows/deploy-pages.yml` automatically:
- Detects user-site vs project-site URLs.
- Sets `VITE_BASE_PATH` and `VITE_SITE_URL` for the build.
- Deploys the Vite `dist/` output to GitHub Pages.

## Production Notes

- SEO and social tags are configured in `index.html`.
- PWA metadata is configured in `public/manifest.json`.
- Sitemap and robots files live in `public/sitemap.xml` and `public/robots.txt`.
- Motion-heavy UI effects automatically scale down for users who prefer reduced motion and for coarse pointer devices.

## CI

GitHub Actions runs `npm ci`, `npm run lint`, and `npm run build` on every push and pull request.
