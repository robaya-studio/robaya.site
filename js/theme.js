// Theme management system
class ThemeManager {
  constructor() {
    this.currentTheme = 'system';
    this.supportedThemes = ['light', 'dark', 'system'];
    this.systemTheme = 'light';
    this.init();
  }

  // Initialize theme manager
  init() {
    this.detectSystemTheme();
    this.loadTheme();
    this.setupSystemThemeListener();
    this.applyTheme();
    console.log('🎨 ThemeManager initialized');
  }

  // Detect system theme
  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.systemTheme = 'dark';
    } else {
      this.systemTheme = 'light';
    }
    console.log('🖥️ System theme detected:', this.systemTheme);
  }

  // Setup listener for system theme changes
  setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this.systemTheme = e.matches ? 'dark' : 'light';
        console.log('🔄 System theme changed to:', this.systemTheme);

        // Only follow the OS automatically when the user hasn't picked a theme manually
        if (this.currentTheme === 'system') {
          this.applyTheme();
        }
      });
    }
  }

  // Load theme from localStorage: an explicit light/dark override, or system by default
  loadTheme() {
    const saved = localStorage.getItem('robayaTheme');
    this.currentTheme = (saved === 'light' || saved === 'dark') ? saved : 'system';
    console.log('📖 Loaded theme:', this.currentTheme);
  }

  // Save theme to localStorage
  saveTheme() {
    localStorage.setItem('robayaTheme', this.currentTheme);
    console.log('💾 Saved theme:', this.currentTheme);
  }

  // Apply current theme to document
  applyTheme() {
    const effectiveTheme = this.getEffectiveTheme();

    document.documentElement.setAttribute('data-theme', effectiveTheme);
    console.log('🎨 Applied theme:', effectiveTheme, `(${this.currentTheme})`);

    document.dispatchEvent(new CustomEvent('robaya:themechange', { detail: { effectiveTheme } }));
  }

  // Manually switch between light/dark, overriding system detection, and persist the choice
  toggleTheme() {
    this.currentTheme = this.getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    this.saveTheme();
    this.applyTheme();
  }

  // Get current theme setting ('light' | 'dark' | 'system')
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Get effective theme (actual applied theme, resolving 'system' to light/dark)
  getEffectiveTheme() {
    return this.currentTheme === 'system' ? this.systemTheme : this.currentTheme;
  }

  // Check if theme is supported
  isThemeSupported(theme) {
    return this.supportedThemes.includes(theme);
  }

  // Get list of supported themes
  getSupportedThemes() {
    return [...this.supportedThemes];
  }

  // Get system theme
  getSystemTheme() {
    return this.systemTheme;
  }
}

// Create global instance
window.themeManager = new ThemeManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, initializing ThemeManager...');
  // ThemeManager is already initialized in constructor
});

// Also export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
