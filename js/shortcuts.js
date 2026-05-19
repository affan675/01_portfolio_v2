// FILE: js/shortcuts.js
(function () {
  'use strict';

  // ---------- Create Overlay ----------
  const overlay = document.createElement('div');
  overlay.id = 'shortcut-overlay';
  overlay.innerHTML = `
    <div class="shortcut-modal">
      <h2><i class="fas fa-keyboard"></i> Shortcuts</h2>
      <ul>
        <li><kbd>T</kbd> Toggle Theme</li>
        <li><kbd>H</kbd> Home</li>
        <li><kbd>P</kbd> Projects</li>
        <li><kbd>R</kbd> Report</li>
        <li><kbd>C</kbd> Contact</li>
        <li><kbd>G</kbd> GitHub</li>
        <li><kbd>?</kbd> <span class="dim">(or ESC)</span> Close this panel</li>
      </ul>
      <p class="tip">Press <kbd>?</kbd> anytime to open this cheatsheet</p>
    </div>
  `;
  document.body.appendChild(overlay);

  // ---------- Inject Styles ----------
  const style = document.createElement('style');
  style.textContent = `
    #shortcut-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    [data-theme="tech"] #shortcut-overlay {
      background: rgba(3,0,20,0.8);
    }
    #shortcut-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .shortcut-modal {
      background: var(--surface, #ffffff);
      border-radius: 24px;
      padding: 2rem 2.5rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      border: 1px solid var(--border, #e2e8f0);
      font-family: 'Inter', sans-serif;
      color: var(--text-primary, #0f172a);
      transform: scale(0.95);
      transition: transform 0.3s ease;
    }
    #shortcut-overlay.visible .shortcut-modal {
      transform: scale(1);
    }
    .shortcut-modal h2 {
      margin-top: 0;
      font-size: 1.8rem;
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--accent, #2563eb);
    }
    .shortcut-modal ul {
      list-style: none;
      padding: 0;
    }
    .shortcut-modal li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--border, #e2e8f0);
      font-size: 1rem;
    }
    .shortcut-modal li:last-child {
      border-bottom: none;
    }
    .shortcut-modal kbd {
      background: var(--border, #e2e8f0);
      border-radius: 6px;
      padding: 0.2rem 0.6rem;
      font-weight: 700;
      font-family: 'Space Grotesk', monospace;
      font-size: 0.9rem;
      color: var(--text-primary, #0f172a);
      box-shadow: 0 2px 0 rgba(0,0,0,0.1);
      min-width: 30px;
      text-align: center;
    }
    .shortcut-modal .dim {
      color: var(--text-secondary, #64748b);
      font-size: 0.85rem;
    }
    .shortcut-modal .tip {
      margin-top: 1.2rem;
      font-size: 0.9rem;
      color: var(--text-secondary, #64748b);
    }
    [data-theme="tech"] .shortcut-modal kbd {
      background: rgba(0,255,255,0.15);
      border: 1px solid rgba(0,255,255,0.4);
      color: var(--primary-glow, #00ffff);
    }
    [data-theme="tech"] .shortcut-modal {
      background: rgba(10,10,26,0.9);
      border-color: rgba(0,255,255,0.3);
    }
  `;
  document.head.appendChild(style);

  // ---------- Toggle Overlay ----------
  function toggleOverlay() {
    overlay.classList.toggle('visible');
  }

  // ---------- Keyboard Event Listener ----------
  document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in an input or textarea
    const tag = e.target.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;
    if (isInput) return;

    const key = e.key.toLowerCase();
    if (key === '?') {
      e.preventDefault();
      toggleOverlay();
      return;
    }
    if (key === 'escape') {
      overlay.classList.remove('visible');
      return;
    }

    // Shortcuts only work when overlay is NOT visible (or you can allow them all the time)
    if (overlay.classList.contains('visible')) return;

    switch (key) {
      case 't':
        // Toggle theme (cycle)
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themes = ['light', 'dark', 'tech'];
        const idx = themes.indexOf(currentTheme);
        const next = themes[(idx + 1) % themes.length];
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('affan-theme', next);
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
        break;
      case 'h':
        window.location.href = 'index.html';
        break;
      case 'p':
        window.location.href = 'projects.html';
        break;
      case 'r':
        window.location.href = 'report.html';
        break;
      case 'c':
        window.location.href = 'contact.html';
        break;
      case 'g':
        window.open('https://github.com/affan675', '_blank');
        break;
    }
  });

  // Close overlay when clicking outside modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('visible');
    }
  });
})();