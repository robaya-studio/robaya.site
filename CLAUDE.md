# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site (GitHub Pages behind Cloudflare, custom domain `robaya.studio` via `CNAME`)
for the mobile games/apps of Robaya Studio: a home page, one landing page per app, per-app
Privacy Policy / Terms pages, and the site's own privacy/terms. Pure HTML/CSS/vanilla JS — no
build step, no package.json, no framework. `README.md` (Russian) is the how-to; this file is
the architecture.

## Running locally

```bash
python3 -m http.server 8000
```

## Architecture

### Pages
- `index.html` — home: hero, app cards (`.app-card`, Hwatu is `--featured`), contact.
- `privacy.html`, `terms.html` — the website's own documents, linking to each app's.
- `games/<app>/index.html` — app landing page; `games/<app>/privacy.html`, `terms.html` — the
  app's agreements. The in-app agreement links point at these URLs (the Hwatu game reads them
  from Remote Config / `AgreementsSettings.asset`), so they must not move.

### Shared chrome (`js/site-chrome.js`)
Injects the sticky header (brand + breadcrumb to the app, nav to the current app's or the
site's privacy/terms, theme toggle, EN/RU switch) and the footer, and turns every
`<span data-icon="name">` into an inline SVG from its `ICONS` table. Page context comes from
the URL (`/games/`, `privacy.html`, `terms.html`) and `<body data-app-name>`. Must load before
`lang.js` so the injected `data-i18n` elements get translated.

### Localization (`js/lang.js`)
Markup carries English fallback text plus `data-i18n` / `data-i18n-src` / `data-i18n-content` /
`data-i18n-aria`. Lookup: the app's table (`window['<folder>Translations']`) → the global
`window.translations` (`js/translations.js`, loaded on every page, app pages included). Languages
are `['en', 'ru']`; choice in `localStorage` (`robayaLanguage`), else `navigator.language`.
`data-i18n-src` values are written from the site root and resolved for `/games/` pages.
A new string = key in both `en` and `ru` + the attribute in markup.

### Theme (`js/theme.js`, `css/style.css`)
Colours are tokens on `:root`, overridden for dark under `@media (prefers-color-scheme: dark)`
(guarded by `:root:not([data-theme="light"])`) and under `:root[data-theme="dark"]`.
`theme.js` follows the OS until the header toggle stores an explicit choice (`robayaTheme`).
Per-app accent: `<body data-accent="sudoku|board-games">` (Hwatu uses the default red).

### No cookies
The site sets no cookies and has no analytics; it only keeps language/theme in localStorage.
There was a cookie banner — removed because nothing was gated on it. Store badges and hls.js are
self-hosted (`img/badges/`, `js/vendor/`); the site makes no third-party requests now — the
Apple-hosted trailer was removed from the Hwatu page (a new video comes later; the privacy pages
still mention the trailer until then). Adding analytics, embeds or fonts from a CDN changes what the
privacy pages (site's and Hwatu's section 17) say — update them in the same change.

### Hwatu agreements
Texts live in `games/hwatu/locales/translations.js`; `node tools/build-hwatu-legal.js`
regenerates `privacy.html` / `terms.html` from it (English fallback + structure). The version
in `privacyLastUpdated` / `termsLastUpdated` must match the game's (Unity repo:
`Assets/ScriptableObjects/AgreementsSettings.asset` and Remote Config `agreements`): raising it
there makes every player accept the documents again.

Each new version of the Hwatu agreements is prepared on its own branch, named after the
versions it publishes: `hwatu-privacy-<x.y.z>-terms-<x.y.z>` (e.g.
`hwatu-privacy-1.5.0-terms-1.4.0`), with the game-page changes of the same release on it too.
It is merged into `master` (`--no-ff`) when that version is published — the merge is the
publication — and right after it the game's Remote Config `agreements` is raised to the same
versions. Never edit agreement texts on `master` directly: a published version must not change
silently.

### Screenshots (`js/screenshot-gallery.js`)
`data-gallery="<path>"` + `data-pattern` (default `0x0ss`; empty with `data-ext` → `1.jpg … N.jpg`)
+ `data-count` + `data-ext` (default `png`); files are `<pattern>-1.<ext> … <pattern>-N.<ext>`.
`data-lang-folders` reads `<path><lang>/` and swaps the images on `robaya:languagechange`.
`.screenshots-grid--landscape` for landscape shots. Hwatu's are the 3.0 promo slides, ru/en,
generated in the Unity repo (`Publishing/Promo/06_site/make_site.py` with `ROBAYA_SITE` set) as
compressed JPEG — not Git LFS: GitHub Pages deploys from the branch and would serve LFS pointer
files instead of images.

## Conventions

- Relative paths: app pages reach shared assets as `../../css/…`, `../../js/…`, `../../img/…`.
- Contact email everywhere: `robaya.studio@gmail.com`.
- Keep one component vocabulary (see the header comment of `css/style.css`); no inline styles.
