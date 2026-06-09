// FILE: js/theme.js
(function() {
  const html = document.documentElement;
  const themeBtns = document.querySelectorAll('[data-theme-btn]');
  const savedTheme = localStorage.getItem('affan-theme') || 'light';
  
  html.setAttribute('data-theme', savedTheme);
  updateActiveButton(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-btn');
      html.setAttribute('data-theme', theme);
      localStorage.setItem('affan-theme', theme);
      updateActiveButton(theme);
      dispatchThemeChange(theme);
    });
  });

  // Listen for theme changes from other sources (right-click, keyboard shortcuts)
  window.addEventListener('themechange', (e) => {
    updateActiveButton(e.detail.theme);
  });

  function updateActiveButton(theme) {
    themeBtns.forEach(b => b.classList.remove('active-theme'));
    const activeBtn = document.querySelector(`[data-theme-btn="${theme}"]`);
    if (activeBtn) activeBtn.classList.add('active-theme');
  }

  function dispatchThemeChange(theme) {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
})();

// --- Hamburger menu (reliable) ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  // Toggle menu when hamburger clicked
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside (optional, good UX)
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}