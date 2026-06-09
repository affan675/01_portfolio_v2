// FILE: js/theme.js – with reliable hamburger
(function() {
  // ---- Theme toggle ----
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

  function updateActiveButton(theme) {
    themeBtns.forEach(b => b.classList.remove('active-theme'));
    const activeBtn = document.querySelector(`[data-theme-btn="${theme}"]`);
    if (activeBtn) activeBtn.classList.add('active-theme');
  }

  function dispatchThemeChange(theme) {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // ---- HAMBURGER MENU (RELIABLE) ----
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) {
      console.warn('Hamburger or navLinks not found');
      return;
    }

    // Remove any existing listeners to avoid duplicates
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    const finalHamburger = newHamburger;
    const finalNavLinks = navLinks;

    function toggleMenu(e) {
      e.stopPropagation();
      finalHamburger.classList.toggle('active');
      finalNavLinks.classList.toggle('active');
    }

    finalHamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    finalNavLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        finalHamburger.classList.remove('active');
        finalNavLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!finalHamburger.contains(e.target) && !finalNavLinks.contains(e.target)) {
        finalHamburger.classList.remove('active');
        finalNavLinks.classList.remove('active');
      }
    });
  }

  // Run after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHamburger);
  } else {
    initHamburger();
  }
})();