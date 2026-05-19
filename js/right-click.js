// FILE: js/right-click.js
(function () {
  'use strict';

  // ---------- Create the menu HTML ----------
  const menu = document.createElement('div');
  menu.id = 'custom-context-menu';
  menu.innerHTML = `
    <ul>
      <li data-action="home"><i class="fas fa-home"></i> Go Home</li>
      <li data-action="theme"><i class="fas fa-palette"></i> Toggle Theme</li>
      <li data-action="github"><i class="fab fa-github"></i> GitHub</li>
      <li data-action="top"><i class="fas fa-arrow-up"></i> Back to Top</li>
      <li class="divider"></li>
      <li data-action="close"><i class="fas fa-times"></i> Close</li>
    </ul>
  `;
  document.body.appendChild(menu);

  // ---------- Inject styles ----------
  const style = document.createElement('style');
  style.textContent = `
    #custom-context-menu {
      position: fixed;
      z-index: 99999;
      background: var(--surface, #ffffff);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 14px;
      box-shadow: var(--card-shadow-hover, 0 12px 40px rgba(0,0,0,0.15));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 0.5rem 0;
      min-width: 200px;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.95);
      transition: opacity 0.2s ease, transform 0.2s ease;
      transform-origin: top left;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: var(--text-primary, #0f172a);
    }
    [data-theme="tech"] #custom-context-menu {
      background: rgba(10, 10, 26, 0.9);
      border-color: rgba(0,255,255,0.3);
      box-shadow: 0 0 30px rgba(0,255,255,0.15);
    }
    #custom-context-menu.visible {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }
    #custom-context-menu ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    #custom-context-menu li {
      padding: 0.65rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      white-space: nowrap;
    }
    #custom-context-menu li:hover {
      background: var(--accent, #2563eb);
      color: #ffffff;
    }
    [data-theme="tech"] #custom-context-menu li:hover {
      background: var(--primary-glow, #00ffff);
      color: #030014;
    }
    #custom-context-menu li i {
      width: 20px;
      text-align: center;
    }
    #custom-context-menu .divider {
      height: 1px;
      background: var(--border, #e2e8f0);
      margin: 0.4rem 0;
      padding: 0;
      pointer-events: none;
    }
    [data-theme="tech"] .divider {
      background: rgba(0,255,255,0.2);
    }
  `;
  document.head.appendChild(style);

  // ---------- Logic ----------
  const body = document.body;

  // Hide menu on any click (except on menu itself)
  document.addEventListener('click', () => hideMenu());

  // Prevent browser's default context menu on the whole page
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  });

  // Show menu at position
  function showMenu(x, y) {
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('visible');
  }

  function hideMenu() {
    menu.classList.remove('visible');
  }

  // Handle menu item clicks using event delegation
  menu.addEventListener('click', (e) => {
    const action = e.target.closest('li')?.getAttribute('data-action');
    if (!action) return;

    hideMenu();

    switch (action) {
      case 'home':
        window.location.href = 'index.html';
        break;
      case 'theme':
        // Cycle through themes
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themes = ['light', 'dark', 'tech'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('affan-theme', nextTheme);
        // If theme.js is present, it might have a function to update active button; we'll dispatch a custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextTheme } }));
        break;
      case 'github':
        window.open('https://github.com/affan675', '_blank');
        break;
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'close':
        // just hide, already hidden
        break;
      default:
        break;
    }
  });

  // Close menu on scroll (optional)
  window.addEventListener('scroll', hideMenu);

  // Adjust position if menu would go off screen
  function adjustPosition() {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = (window.innerWidth - rect.width - 5) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = (window.innerHeight - rect.height - 5) + 'px';
    }
  }

  const observer = new MutationObserver(() => {
    if (menu.classList.contains('visible')) {
      adjustPosition();
    }
  });
  observer.observe(menu, { attributes: true, attributeFilter: ['class'] });

})();