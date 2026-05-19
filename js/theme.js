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