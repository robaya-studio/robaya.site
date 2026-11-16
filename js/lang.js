// Language management.
// Every page holds English fallback text in its markup and data-i18n* attributes; this swaps
// them for the selected language at runtime, without a reload.
//
//   data-i18n="key"          → textContent (alt for <img>)
//   data-i18n-src="key"      → src         (localized store badges)
//   data-i18n-content="key"  → content     (<meta name="description">)
//   data-i18n-aria="key"     → aria-label
//
// Lookup order: the app's own table (window['<folder>Translations'] from games/<folder>/locales/
// translations.js) → the global table
// (window.translations from js/translations.js). Both are plain synchronous scripts in <head>,
// so they exist by DOMContentLoaded.
class LanguageManager {
  constructor() {
    this.supportedLanguages = ['en', 'ru'];
    this.currentLanguage = 'en';
    this.globalTranslations = null;
    this.appTranslations = null;
  }

  init() {
    this.globalTranslations = window.translations || null;
    this.appTranslations = this.findAppTranslations();

    document.querySelectorAll('.lang-switch a[data-lang]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.setLanguage(link.getAttribute('data-lang'));
      });
    });

    this.setLanguage(this.detectLanguage(), false);
  }

  findAppTranslations() {
    const match = window.location.pathname.match(/\/games\/([^/]+)\//);
    if (!match) {
      return null;
    }
    // The folder name as is (window['board-game-assistantTranslations']) or in camelCase
    const folder = match[1];
    const camel = folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return window[`${folder}Translations`] || window[`${camel}Translations`] || null;
  }

  detectLanguage() {
    try {
      const saved = localStorage.getItem('robayaLanguage');
      if (this.supportedLanguages.includes(saved)) {
        return saved;
      }
    } catch (e) {
      // Storage can be unavailable (private mode, blocked site data) — fall through
    }

    const browser = (navigator.language || 'en').split('-')[0];
    return this.supportedLanguages.includes(browser) ? browser : 'en';
  }

  setLanguage(lang, persist = true) {
    if (!this.supportedLanguages.includes(lang)) {
      return;
    }

    this.currentLanguage = lang;
    if (persist) {
      try {
        localStorage.setItem('robayaLanguage', lang);
      } catch (e) {
        // Not persisted; the choice still applies to this page
      }
    }

    document.documentElement.lang = lang;
    this.updateContent();

    document.querySelectorAll('.lang-switch a[data-lang]').forEach((link) => {
      const active = link.getAttribute('data-lang') === lang;
      link.classList.toggle('active', active);
      link.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('robaya:languagechange', { detail: { lang } }));
  }

  getTranslation(key) {
    const lang = this.currentLanguage;
    const fromApp = this.appTranslations && this.appTranslations[lang] && this.appTranslations[lang][key];
    if (fromApp) {
      return fromApp;
    }
    const fromGlobal = this.globalTranslations && this.globalTranslations[lang] && this.globalTranslations[lang][key];
    return fromGlobal || null;
  }

  updateContent() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = this.getTranslation(el.getAttribute('data-i18n'));
      if (!value) {
        return;
      }
      if (el.tagName === 'IMG') {
        el.alt = value;
      } else {
        el.textContent = value;
      }
    });

    this.applyAttribute('data-i18n-src', 'src');
    this.applyAttribute('data-i18n-content', 'content');
    this.applyAttribute('data-i18n-aria', 'aria-label');
  }

  applyAttribute(dataAttribute, targetAttribute) {
    document.querySelectorAll(`[${dataAttribute}]`).forEach((el) => {
      const value = this.getTranslation(el.getAttribute(dataAttribute));
      if (value) {
        el.setAttribute(targetAttribute, targetAttribute === 'src' ? this.resolveSitePath(value) : value);
      }
    });
  }

  // Translated asset paths are written from the site root (img/badges/...); app pages live
  // two levels down.
  resolveSitePath(path) {
    if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) {
      return path;
    }
    return window.location.pathname.includes('/games/') ? `../../${path}` : path;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

window.langManager = new LanguageManager();

document.addEventListener('DOMContentLoaded', () => {
  window.langManager.init();
});
