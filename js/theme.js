// Theme management.
// Follows the OS (prefers-color-scheme) until the visitor picks light or dark with the header
// toggle; the explicit choice is kept in localStorage (robayaTheme). Applies data-theme on <html>
// as soon as the script runs in <head>, so the page never flashes the wrong palette.
class ThemeManager {
  constructor() {
    this.media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    this.currentTheme = this.loadTheme();

    if (this.media) {
      this.media.addEventListener('change', () => {
        if (this.currentTheme === 'system') {
          this.applyTheme();
        }
      });
    }

    this.applyTheme();
  }

  loadTheme() {
    try {
      const saved = localStorage.getItem('robayaTheme');
      return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch (e) {
      return 'system';
    }
  }

  getEffectiveTheme() {
    if (this.currentTheme !== 'system') {
      return this.currentTheme;
    }
    return this.media && this.media.matches ? 'dark' : 'light';
  }

  applyTheme() {
    const effectiveTheme = this.getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.dispatchEvent(new CustomEvent('robaya:themechange', { detail: { effectiveTheme } }));
  }

  toggleTheme() {
    this.currentTheme = this.getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('robayaTheme', this.currentTheme);
    } catch (e) {
      // Not persisted; the choice still applies to this page
    }
    this.applyTheme();
  }
}

window.themeManager = new ThemeManager();
