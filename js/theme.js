// FILE: js/theme.js – Perfect: hamburger, theme toggles, mobile cycler, sync with external changes
(function() {
  const html = document.documentElement;
  const themeBtns = document.querySelectorAll('[data-theme-btn]');
  const savedTheme = localStorage.getItem('affan-theme') || 'light';
  
  // Set initial theme
  html.setAttribute('data-theme', savedTheme);
  updateActiveButton(savedTheme);

  // Helper: update active class on original buttons (desktop)
  function updateActiveButton(theme) {
    themeBtns.forEach(b => b.classList.remove('active-theme'));
    const activeBtn = document.querySelector(`[data-theme-btn="${theme}"]`);
    if (activeBtn) activeBtn.classList.add('active-theme');
  }

  // Core theme setter – updates DOM, storage, active button, dispatches event
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('affan-theme', theme);
    updateActiveButton(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // Listen to clicks on original theme buttons (desktop & tablet)
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-btn');
      setTheme(theme);
    });
  });

  // ---- Hamburger menu (reliable, works on all pages) ----
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;
    function toggle(e) {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    }
    hamburger.addEventListener('click', toggle);
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ---- Mobile single theme button cycler (with sync) ----
  let mobileCycleButton = null;          // to avoid duplicate creation
  let currentMobileTheme = null;         // keep track for the cycle button

  function initMobileTheme() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const toggleGroup = document.querySelector('.theme-toggle-group');
    if (!toggleGroup) return;

    // If the cycle button already exists, do nothing
    if (mobileCycleButton && toggleGroup.contains(mobileCycleButton)) return;

    // Hide all original theme buttons
    const originalBtns = toggleGroup.querySelectorAll('.theme-btn');
    originalBtns.forEach(btn => btn.style.display = 'none');

    // Get current theme
    currentMobileTheme = html.getAttribute('data-theme') || 'light';
    const themes = ['light', 'dark', 'tech'];
    const icons = { light: '☀️', dark: '🌙', tech: '🧬' };

    // Create cycle button
    const cycleBtn = document.createElement('button');
    cycleBtn.className = 'theme-btn mobile-cycle-btn';
    cycleBtn.textContent = icons[currentMobileTheme];
    cycleBtn.setAttribute('aria-label', 'Cycle theme');
    toggleGroup.appendChild(cycleBtn);
    mobileCycleButton = cycleBtn;

    // Cycle on click
    cycleBtn.addEventListener('click', () => {
      const idx = themes.indexOf(currentMobileTheme);
      const next = themes[(idx + 1) % themes.length];
      setTheme(next);
      // currentMobileTheme will be updated via the event listener below
    });

    // Listen to any theme change (from setTheme or external source like right-click)
    window.addEventListener('themechange', (e) => {
      const newTheme = e.detail.theme;
      currentMobileTheme = newTheme;
      if (mobileCycleButton) {
        mobileCycleButton.textContent = icons[newTheme];
      }
    });
  }

  // ---- Listen to resize events to re‑initialize mobile theme if needed ----
  // (e.g., user rotates device or resizes window from desktop to mobile)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile && !mobileCycleButton) {
        initMobileTheme();
      } else if (!isMobile && mobileCycleButton) {
        // If we are no longer on mobile and the cycle button exists, remove it and show original buttons
        const toggleGroup = document.querySelector('.theme-toggle-group');
        if (toggleGroup && mobileCycleButton && toggleGroup.contains(mobileCycleButton)) {
          mobileCycleButton.remove();
          mobileCycleButton = null;
          // Restore original buttons
          const originalBtns = toggleGroup.querySelectorAll('.theme-btn');
          originalBtns.forEach(btn => btn.style.display = '');
        }
      }
    }, 150);
  });

  // Initialize everything after DOM ready
  function init() {
    initHamburger();
    initMobileTheme();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();