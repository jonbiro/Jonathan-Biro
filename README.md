# Jonathan Biro Portfolio

Personal portfolio for Jonathan Biro, built around clear quality-engineering proof and an accessible recruiter journey.

## Highlights

- Command palette (`Ctrl/Cmd + K`) for fast navigation and quick actions.
- Responsive navigation and selected work with concrete quality-engineering details.
- Recruiter-friendly QA approach and capability sections.
- Interactive QA Bug Hunt mini-game for engagement.
- System-aware motion controls, focus-managed dialogs, and touch-sized controls.
- Automated behavior tests, Lighthouse budgets, and dependency auditing.
- Enforced coverage floors so new code cannot silently reduce the tested surface.

## Stack

- React 19
- Vite 8
- Tailwind CSS 3
- Framer Motion
- Vitest and Testing Library
- Cloudflare Workers and OpenAI Sites
- ESLint 9

## Run Locally

```bash
npm install
npm run dev
```

## Build and Verify

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
```

## Deploy on Netlify

1. Connect this repo in Netlify.
2. Keep the build settings from `netlify.toml`.
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
- Deploys the browser bundle from `dist/client` to GitHub Pages.

## Deploy on Cloudflare or Sites

The Cloudflare worker entry is `worker/index.js`, and `wrangler.jsonc` configures SPA asset handling. Production responses receive security headers plus long-lived caching for fingerprinted assets.

The OpenAI Sites project is linked through `.openai/hosting.json`. Builds emit the browser bundle in `dist/client` and the worker bundle in `dist/server`.

## Production Notes

- SEO and social tags are configured in `index.html`.
- PWA metadata is configured in `public/manifest.json`.
- Sitemap and robots source files live in `public/`; production-specific copies are generated directly into the build output.
- Motion-heavy UI effects automatically scale down for users who prefer reduced motion and for coarse pointer devices.
- The initial HTML includes meaningful portfolio content before React loads.
- `scripts/generate-seo-files.mjs` keeps robots and sitemap origins aligned with `VITE_SITE_URL`.

## CI

GitHub Actions runs linting, coverage-gated behavior tests, dependency auditing, a production build, and Lighthouse CI on every push and pull request.
