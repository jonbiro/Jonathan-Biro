# Jonathan Biro Portfolio

Personal portfolio for Jonathan Biro, built around clear quality-engineering proof and an accessible recruiter journey.

## Highlights

- Focused software-engineering and SDET story with verified DocMagic and Priceline experience.
- One relevant public case study that connects product work, source code, test coverage, and release checks.
- Responsive, semantic navigation with keyboard focus management, a skip link, screen-reader context, and touch-sized controls.
- Public GitHub and CI evidence surfaced directly in the recruiter journey.
- Canonical metadata, structured data, a branded 404, and an installable web manifest.
- Automated behavior tests, coverage floors, dependency auditing, production builds, and Lighthouse budgets.
- Netlify security headers, a hash-based script policy, and immutable caching for fingerprinted assets.

## Stack

- React 19
- Vite 8
- Hand-authored responsive CSS
- Vitest and Testing Library
- Netlify
- GitHub Actions
- ESLint 9

## Run Locally

```bash
npm ci
npm run dev
```

Local development, production builds, and previews use canonical `https://jonathanbiro.com` metadata by default. Override `VITE_SITE_URL` and `VITE_BASE_PATH` when validating another host or a subpath deployment.

## Build and Verify

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
```

## Deploy on Netlify

1. Connect `jonbiro/Jonathan-Biro`, branch `main`, to the existing Netlify project `jonbiro`.
2. Keep the build settings from `netlify.toml`.
3. Keep DNS at Squarespace: apex `A` → `75.2.60.5`, `www` `CNAME` → `jonbiro.netlify.app`.

Netlify will run:

```bash
npm run build
```

`netlify.toml` sets `VITE_SITE_URL=https://jonathanbiro.com`. The build emits a portable browser bundle in `dist/client`, generates production discovery files, and replaces the inline-script CSP placeholder with the exact SHA-256 hash from the built HTML.

## Deploy on GitHub Pages

1. In GitHub, open `Settings` > `Pages`.
2. Under `Build and deployment`, set `Source` to `GitHub Actions`.
3. Run the `Deploy to GitHub Pages` workflow manually. Push-triggered Pages deployment is disabled because Netlify is the production host.

The workflow in `.github/workflows/deploy-pages.yml` automatically:
- Detects user-site vs project-site URLs.
- Sets `VITE_BASE_PATH` and `VITE_SITE_URL` for the build.
- Deploys the browser bundle from `dist/client` to GitHub Pages.

## Production Notes

- SEO and social tags are configured in `index.html`.
- PWA metadata is configured in `public/manifest.json`.
- Sitemap and robots source files live in `public/`; production-specific copies are generated directly into the build output.
- `public/_headers` is the source template for Netlify security and cache policy; the built copy receives exact inline-script hashes.
- The initial HTML includes meaningful portfolio content before React loads.
- `scripts/generate-seo-files.mjs` keeps robots, sitemap, and the built Content Security Policy aligned with each deployment.

## CI

GitHub Actions runs linting, coverage-gated behavior tests, dependency auditing, a production build, and Lighthouse CI on every push and pull request.
