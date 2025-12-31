// Theme toggle functionality
(function() {
  const STORAGE_KEY = 'theme-preference';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  function getColorPreference() {
    if (localStorage.getItem(STORAGE_KEY)) {
      return localStorage.getItem(STORAGE_KEY);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButton(theme);
  }

  function updateToggleButton(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      if (theme === DARK_THEME) {
        toggle.textContent = '☀️';
        toggle.setAttribute('title', 'Switch to light mode');
      } else {
        toggle.textContent = '🌙';
        toggle.setAttribute('title', 'Switch to dark mode');
      }
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getColorPreference();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
  }

  // Initialize theme on page load
  window.addEventListener('DOMContentLoaded', function() {
    const theme = getColorPreference();
    setTheme(theme);
    
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }
  });
})();
