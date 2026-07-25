// Shared site chrome: language switcher, home button, theme toggle.
// Injected at runtime (like js/cookie-consent.js) so this markup doesn't need
// to be hand-copied into every page. Must be loaded before js/lang.js so the
// injected data-i18n elements exist before LanguageManager translates the page.
class SiteChromeManager {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => this.render());
  }

  isGamePage() {
    return window.location.pathname.includes('/games/');
  }

  isHomePage() {
    if (this.isGamePage()) return false;
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/') || path.endsWith('/index.html');
  }

  isPrivacyPage() {
    return window.location.pathname.endsWith('/privacy.html');
  }

  isTermsPage() {
    return window.location.pathname.endsWith('/terms.html');
  }

  render() {
    const fragment = document.createDocumentFragment();

    if (!this.isHomePage() && !document.querySelector('.home-button')) {
      fragment.appendChild(this.buildHomeButton());
    }
    if (!document.querySelector('.top-controls')) {
      fragment.appendChild(this.buildTopControls());
    }

    document.body.prepend(fragment);

    this.renderFooter();
  }

  // Footer legal links (Privacy / Terms / email / "back to game") follow a
  // fixed pattern purely from page type, so it's generated instead of
  // hand-copied into every page.
  renderFooter() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('.page-footer')) return;

    const isPrivacy = this.isPrivacyPage();
    const isTerms = this.isTermsPage();
    const links = [];

    if (this.isGamePage() && (isPrivacy || isTerms)) {
      links.push({ href: 'index.html', key: 'backToGame', text: '← Back' });
    }
    if (!isPrivacy) {
      links.push({ href: 'privacy.html', key: 'privacy', text: 'Privacy Policy' });
    }
    if (!isTerms) {
      links.push({ href: 'terms.html', key: 'terms', text: 'Terms of Use' });
    }
    if (!isPrivacy && !isTerms) {
      links.push({ href: 'mailto:robaya.studio@gmail.com', key: 'email', text: 'robaya.studio@gmail.com' });
    }

    const footer = document.createElement('footer');
    footer.className = 'page-footer';

    const linksWrap = document.createElement('div');
    linksWrap.className = 'footer-links';

    links.forEach(({ href, key, text }) => {
      const a = document.createElement('a');
      a.href = href;
      a.setAttribute('data-i18n', key);
      a.textContent = text;
      linksWrap.appendChild(a);
    });

    footer.appendChild(linksWrap);
    container.appendChild(footer);
  }

  buildTopControls() {
    const wrapper = document.createElement('div');
    wrapper.className = 'top-controls';
    wrapper.appendChild(this.buildThemeToggle());
    wrapper.appendChild(this.buildLangSwitch());
    return wrapper;
  }

  buildLangSwitch() {
    const el = document.createElement('div');
    el.className = 'lang-switch';
    el.innerHTML = `
      <a href="#" data-lang="en">🇺🇸 EN</a>
      <a href="#" data-lang="ru">🇷🇺 RU</a>
    `;
    return el;
  }

  buildHomeButton() {
    const el = document.createElement('a');
    el.href = this.isGamePage() ? '../../index.html' : 'index.html';
    el.className = 'home-button';
    el.innerHTML = `
      <span class="home-icon">🏠</span>
      <span data-i18n="home">Home</span>
    `;
    return el;
  }

  buildThemeToggle() {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'theme-toggle';
    this.updateThemeToggleIcon(el);
    el.addEventListener('click', () => window.themeManager.toggleTheme());
    document.addEventListener('robaya:themechange', () => this.updateThemeToggleIcon(el));
    return el;
  }

  updateThemeToggleIcon(button) {
    const effectiveTheme = window.themeManager ? window.themeManager.getEffectiveTheme() : 'light';
    button.textContent = effectiveTheme === 'dark' ? '☀️' : '🌙';
    button.setAttribute('aria-label', effectiveTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

// Create global instance
window.siteChromeManager = new SiteChromeManager();

// Also export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SiteChromeManager;
}
