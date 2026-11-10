# Lucian Uritu's portfolio

A dependency-free HTML, CSS, and JavaScript portfolio with six small interactive project previews.

## Run locally

```powershell
node scripts/preview.cjs
```

Open http://127.0.0.1:3006. Use an HTTP server rather than opening the HTML file directly, because the JavaScript uses ES modules.

## Build

```powershell
node scripts/build.cjs
```

The deployable static site is written to `dist/`. Run this after editing source files.

## Edit content

Project descriptions, repository links, and technical skills live in `scripts/data/portfolioProfile.js`. Personal background and contact details live in `index.html`.

The project previews illustrate each project's idea. They are independent portfolio interactions, not embedded versions of the full research applications. The traffic preview starts paused, and motion respects the visitor's reduced-motion preference.
