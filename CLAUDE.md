# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site (GitHub Pages, custom domain `robaya.studio` via `CNAME`) listing mobile games/apps built by Robaya Studio, with a landing page per app plus shared Privacy Policy / Terms of Use pages. Pure HTML/CSS/vanilla JS — no build step, no package.json, no framework.

## Running locally

No build/lint/test tooling exists. Serve the directory with any static file server and open it in a browser:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. `test.html` at the repo root is a manual scratch page for exercising the localization system in isolation.

## Architecture

### Page types
- `index.html` — home page, grid of game cards linking to `games/<name>/`.
- `privacy.html`, `terms.html` — site-wide legal pages.
- `games/<name>/index.html` — one landing page per app (Hwatu, Sudoku, Board Games Assistant).
- `games/<name>/privacy.html`, `games/<name>/terms.html` — per-app legal pages (not every app has both; check before assuming one exists).

Every game lives entirely under `games/<name>/` with its own `AppIcon.png`, `screenshots/`, and `locales/translations.js`. There is no shared game template file to copy — new games are created by hand-writing HTML that follows the pattern of an existing game folder (see `README.md`, which has a full step-by-step example).

### Localization (`js/lang.js` + translations files)
Single-page-per-language-pair model: HTML contains both the markup and `data-i18n="key"` attributes with English fallback text; JS swaps `textContent`/`alt`/`placeholder`/`title` at runtime. No page reload, no server-side rendering.

- `window.langManager` (`js/lang.js`) is the one instance driving all translation. On `DOMContentLoaded` it detects whether the current path contains `/games/` — if so it waits for a **game-specific** global (`window.<gameName>Translations`, e.g. `window.hwatuTranslations`) set by `games/<name>/locales/translations.js`; otherwise it waits for `window.translations` set by the root `js/translations.js`.
- `getTranslation(key)` checks `gameTranslations` first, then falls back to the global `translations` object — so a game page can override a global key like `home` or `email` if needed.
- Language choice persists in `localStorage` (`robayaLanguage`) and falls back to `navigator.language`. Supported languages are hardcoded as `['en', 'ru']` in `LanguageManager.supportedLanguages` — adding a language means updating that array *and* adding the translation keys everywhere, not just adding translations.
- `.lang-switch a[data-lang]` elements anywhere on the page are auto-wired as language switch buttons.

When adding any new translatable string: add the key to both `en` and `ru` blocks in the relevant translations file (global `js/translations.js` for site-wide content, `games/<name>/locales/translations.js` for game-specific content), and add `data-i18n="key"` to the element with the English text as static fallback content.

### Theming (`js/theme.js`)
`window.themeManager` sets `data-theme="light|dark"` on `<html>` purely from `prefers-color-scheme`, live-updating on OS theme change. There is currently no manual light/dark toggle in the UI — theme is fully automatic. `css/style.css` keys dark-mode overrides off `[data-theme="dark"]`.

### Cookie consent (`js/cookie-consent.js`)
`window.cookieConsentManager` injects a banner into `document.body` on first visit (checked via a `robayaCookieConsent` cookie, not localStorage) and links "Learn More" to the correct relative `privacy.html` depending on whether the current page is under `/games/`. Uses the same `data-i18n` mechanism and retries translation application on a timer since it can render before `langManager`/translations finish loading.

### Screenshot galleries (`js/screenshot-gallery.js`)
Opt-in via `data-gallery="<path>"` on a container plus optional `data-pattern` (filename prefix, default `0x0ss`) and `data-count` (default 9). It builds a horizontally-scrolling carousel with arrow nav and a shared full-screen lightbox (created once per page, reused across all galleries on that page). Screenshot files must already exist under the given path following the `<pattern>.png`, `<pattern>-2.png`, `<pattern>-3.png`, ... naming convention (see any `games/<name>/screenshots/` folder).

### Script load order matters
Game pages load, in this order: game-specific `locales/translations.js` → `../../js/lang.js` → `../../js/theme.js` → `../../js/cookie-consent.js` (and `../../js/screenshot-gallery.js` if the page has galleries). `lang.js` polls with `setTimeout` for the translations globals rather than relying on load order, but keep the convention when adding new pages regardless.

## Conventions to follow when extending the site

- New game folders replicate the existing structure exactly: `index.html`, `locales/translations.js` (exporting `window.<gameName>Translations`), `AppIcon.png`, `screenshots/`. Add a card to the home page grid in `index.html` and a translation key set for the new game's title/description/features in `js/translations.js`.
- Keep relative paths correct: game pages reference shared assets as `../../css/style.css`, `../../js/*.js`; legal pages inside a game folder are one level up: `../../privacy.html`.
- `rtat.store@gmail.com` is the contact email used in page footers site-wide — reuse the existing `mailto:` markup/`data-i18n="email"` pattern rather than hardcoding a new one.
