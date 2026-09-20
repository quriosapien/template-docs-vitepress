# template-docs-vitepress

A reusable documentation site template built with [VitePress](https://vitepress.dev).

> [!NOTE]
> This template tracks the VitePress 2 pre-release line (currently
> `2.0.0-alpha.20`) — a deliberate exception to this template family's
> "no pre-release deps" convention. VitePress 1.6.4 — the last stable
> release, from August 2025 — pins Vite 5, which carries an unfixable
> high-severity path-traversal advisory in its dev server
> ([GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) and
> related). Forcing a newer Vite via `overrides` does not work: VitePress 1.x
> calls `transformWithEsbuild`, which Vite 8 removed. VitePress 2 runs on Vite 8
> (via `2.0.0-alpha.20`) and `npm audit` is clean. Re-checked during the
> 2026-09-20 weekly dependency pass — `2.0.0-alpha.20` is still the newest
> alpha and the build still works. Move to `^2.0.0` once it ships stable.

## Prerequisites

- Node.js 26 or later

## Commands

```sh
npm i                 # install dependencies
npm run docs:dev     # start local dev server
npm run docs:build   # build for production
npm run docs:preview # preview the production build
```

## Structure

Docs content and site config/theme live in separate top-level folders:

```text
content/               # docs content only — edit this for pages
├── index.md          # home page
├── guide/
│   ├── index.md
│   ├── getting-started.md
│   └── vue-components.md
└── public/            # static assets (logo, images, etc.)

.vitepress/             # config + theme only
├── config.ts          # nav, sidebar, theme, and search config (srcDir: "content")
└── theme/             # custom theme and components
```

To adapt this template, edit the pages under `content/` and update the `nav`/`sidebar` in `.vitepress/config.ts` to match.

## Notes

- [`notes/authentication.md`](notes/authentication.md) — options for adding an auth layer in front of this docs site, if a project needs to restrict access.
