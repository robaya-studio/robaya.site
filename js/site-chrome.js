// Shared site chrome: sticky header (brand, nav, theme toggle, language switch), footer and
// the inline SVG icon set. Injected at runtime so this markup isn't hand-copied into every page.
// Must be loaded before js/lang.js: the injected data-i18n elements have to exist before
// LanguageManager translates the page (both listen to DOMContentLoaded, in load order).
//
// Page context comes from the URL (/games/<app>/..., privacy.html, terms.html) and from
// <body data-app-name="Hwatu"> on app pages (fallback text for the breadcrumb, translated
// through the "appName" key of the app's locales file).

(function () {
  const ICONS = {
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3.5" r="1"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-6 6.5-6s5.9 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.3c2 .8 3.2 2.9 3.5 5.7"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5.5a3 3 0 0 0 3 4.2"/><path d="M16 6h2.5a3 3 0 0 1-3 4.2"/><path d="M12 13v4"/><path d="M8.5 20.5h7"/><path d="M10 17h4v3.5h-4z"/>',
    medal: '<circle cx="12" cy="15" r="5.5"/><path d="M8.5 10.7L6 3.5h4l2 4.5 2-4.5h4l-2.5 7.2"/><path d="M12 12.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>',
    bag: '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="17.5" cy="6" r="2.5"/><circle cx="17.5" cy="18" r="2.5"/><path d="M8.2 10.8l7.1-3.6"/><path d="M8.2 13.2l7.1 3.6"/>',
    quests: '<path d="M4 6l1.5 1.5L8 5"/><path d="M4 12l1.5 1.5L8 11"/><path d="M4 18l1.5 1.5L8 17"/><path d="M11 6h9"/><path d="M11 12h9"/><path d="M11 18h9"/>',
    flame: '<path d="M12 3c.5 3 4.5 5 4.5 10a4.5 4.5 0 0 1-9 0c0-2 1-3.5 2-4.5 0 1.5.8 2.5 2 2.5 0-3-1-5.5.5-8z"/>',
    chart: '<path d="M4 20h16"/><path d="M7 16v-4"/><path d="M12 16V7"/><path d="M17 16v-7"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.8 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="14.5" cy="7" r="1" fill="currentColor"/><circle cx="17" cy="10.5" r="1" fill="currentColor"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 9.3 4.4 4.4 0 0 0 7 18z"/>',
    sparkles: '<path d="M11 3l1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7L4.5 9.5l4.7-1.8z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    cards: '<rect x="3.5" y="5" width="10.5" height="15" rx="1.5"/><path d="M16.5 6l3 .8a1.5 1.5 0 0 1 1 1.8l-3 11.2a1.5 1.5 0 0 1-1.8 1.1l-2.2-.6"/>',
    gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8"/><path d="M12 8v12"/><path d="M12 8C10 4 7 4.5 7 6.3 7 8 12 8 12 8z"/><path d="M12 8c2-4 5-3.5 5-1.7C17 8 12 8 12 8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8"/><path d="M12 8v4l3 2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    grid: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9.2 3.5v17"/><path d="M14.8 3.5v17"/><path d="M3.5 9.2h17"/><path d="M3.5 14.8h17"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/><path d="M9.5 2.5h5"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/>',
    calculator: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6h8v3.5H8z"/><path d="M8.5 13h.01"/><path d="M12 13h.01"/><path d="M15.5 13h.01"/><path d="M8.5 17h.01"/><path d="M12 17h.01"/><path d="M15.5 17h.01"/>',
    shuffle: '<path d="M3 7h3.5c4 0 5 10 9 10H21"/><path d="M18 14l3 3-3 3"/><path d="M3 17h3.5c1.5 0 2.5-1.3 3.3-3"/><path d="M13.2 10c.8-1.7 1.8-3 3.3-3H21"/><path d="M18 4l3 3-3 3"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2"/><path d="M12 19.5v2"/><path d="M4.6 4.6l1.4 1.4"/><path d="M18 18l1.4 1.4"/><path d="M2.5 12h2"/><path d="M19.5 12h2"/><path d="M4.6 19.4L6 18"/><path d="M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6"/><path d="M9 16h6"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>'
  };

  function iconSvg(name) {
    const body = ICONS[name];
    if (!body) {
      return '';
    }
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  const BRAND_MARK = `
    <svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor"/>
      <circle cx="21" cy="11.5" r="6" fill="#d7261e"/>
      <path d="M6 26c2.6-4.6 6.4-7 11.5-7 3.4 0 6.2 1 8.5 3V26z" fill="var(--bg)" opacity=".92"/>
    </svg>`;

  class SiteChrome {
    constructor() {
      this.path = window.location.pathname;
      this.isAppPage = this.path.includes('/games/');
      this.isPrivacy = this.path.endsWith('/privacy.html');
      this.isTerms = this.path.endsWith('/terms.html');
      this.root = this.isAppPage ? '../../' : '';
      document.addEventListener('DOMContentLoaded', () => this.render());
    }

    render() {
      this.renderIcons(document);
      document.body.prepend(this.buildHeader());
      document.body.appendChild(this.buildFooter());
      this.trackScroll();
    }

    // <span data-icon="trophy"></span> → inline SVG
    renderIcons(scope) {
      scope.querySelectorAll('[data-icon]').forEach((el) => {
        if (!el.querySelector('svg')) {
          el.insertAdjacentHTML('afterbegin', iconSvg(el.getAttribute('data-icon')));
        }
      });
    }

    link(href, key, text, current) {
      const a = document.createElement('a');
      a.href = href;
      a.setAttribute('data-i18n', key);
      a.textContent = text;
      if (current) {
        a.setAttribute('aria-current', 'page');
      }
      return a;
    }

    buildHeader() {
      const header = document.createElement('header');
      header.className = 'site-header';
      header.innerHTML = `
        <div class="wrap site-header__inner">
          <div class="brand">
            <a class="brand__home" href="${this.root}index.html">${BRAND_MARK}<span>ROBAYA</span></a>
          </div>
          <nav class="site-nav" aria-label="Main"></nav>
          <div class="header-actions">
            <button type="button" class="icon-button theme-toggle"></button>
            <div class="lang-switch" role="group" aria-label="Language">
              <a href="#" data-lang="en" lang="en">EN</a>
              <a href="#" data-lang="ru" lang="ru">RU</a>
            </div>
          </div>
        </div>`;

      const brand = header.querySelector('.brand');
      const appName = document.body.getAttribute('data-app-name');
      if (this.isAppPage && appName) {
        const sep = document.createElement('span');
        sep.className = 'brand__sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = '/';
        brand.appendChild(sep);
        const crumb = this.link('index.html', 'appName', appName, false);
        crumb.className = 'brand__crumb';
        brand.appendChild(crumb);
      }

      const nav = header.querySelector('.site-nav');
      if (!this.isAppPage) {
        nav.appendChild(this.link(`${this.root}index.html#apps`, 'navApps', 'Apps', false));
      }
      nav.appendChild(this.link('privacy.html', 'privacy', 'Privacy Policy', this.isPrivacy));
      nav.appendChild(this.link('terms.html', 'terms', 'Terms of Use', this.isTerms));

      const toggle = header.querySelector('.theme-toggle');
      this.updateThemeToggle(toggle);
      toggle.addEventListener('click', () => window.themeManager.toggleTheme());
      document.addEventListener('robaya:themechange', () => this.updateThemeToggle(toggle));

      return header;
    }

    updateThemeToggle(button) {
      const dark = window.themeManager && window.themeManager.getEffectiveTheme() === 'dark';
      button.innerHTML = iconSvg(dark ? 'sun' : 'moon');
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    buildFooter() {
      const footer = document.createElement('footer');
      footer.className = 'site-footer';
      footer.innerHTML = `
        <div class="wrap site-footer__inner">
          <p>© ${new Date().getFullYear()} ROBAYA Studio</p>
          <div class="footer-links"></div>
        </div>`;

      const links = footer.querySelector('.footer-links');
      if (this.isAppPage) {
        if (this.isPrivacy || this.isTerms) {
          links.appendChild(this.link('index.html', 'backToApp', '← Back', false));
        }
        links.appendChild(this.link(`${this.root}index.html`, 'allApps', 'All apps', false));
      }
      links.appendChild(this.link('privacy.html', 'privacy', 'Privacy Policy', this.isPrivacy));
      links.appendChild(this.link('terms.html', 'terms', 'Terms of Use', this.isTerms));

      const mail = document.createElement('a');
      mail.href = 'mailto:robaya.studio@gmail.com';
      mail.textContent = 'robaya.studio@gmail.com';
      links.appendChild(mail);

      return footer;
    }

    trackScroll() {
      const header = document.querySelector('.site-header');
      const update = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  }

  window.robayaIcon = iconSvg;
  window.siteChrome = new SiteChrome();
})();
