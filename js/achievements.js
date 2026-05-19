// FILE: js/achievements.js (session-based, reset on reload)
(function () {
  'use strict';

  // Toast helper
  function showToast(message, icon = '🏆') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = icon + ' ' + message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3500);
  }

  // Achievements store (sessionStorage – resets every new tab/window)
  const STORAGE_KEY = 'affan-achievements-session';
  let unlocked = {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) unlocked = JSON.parse(stored);
  } catch (e) {}

  function unlock(id) {
    if (unlocked[id]) return false;
    unlocked[id] = true;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    return true;
  }

  // ---------- Achievement Definitions (fun & varied) ----------
  const achievements = [
    { id: 'first-visit',   cond: () => !unlocked['first-visit'],          msg: 'Welcome, Builder!',       icon: '👋' },
    { id: 'click-master',  cond: () => true,                              msg: 'Click Master',            icon: '🖱️',  trigger: 'clickCount', threshold: 7 },
    { id: 'theme-changer', cond: () => true,                              msg: 'Theme Sorcerer',          icon: '🎨',  trigger: 'themeChange' },
    { id: 'scroll-bottom', cond: () => true,                              msg: 'Scroll to the Depths',    icon: '⬇️',  trigger: 'scrollBottom' },
    { id: 'full-house',    cond: () => true,                              msg: 'Full House – All Pages!', icon: '🏠',  trigger: 'pageVisit', threshold: 5 },
    { id: 'right-clicker', cond: () => true,                              msg: 'Right‑Click Explorer',    icon: '🖱️',  trigger: 'contextMenu' },
    { id: 'keyboard-hero', cond: () => true,                              msg: 'Keyboard Hero',            icon: '⌨️',  trigger: 'keyPress', threshold: 15 },
    { id: 'hover-magnet',  cond: () => true,                              msg: 'Magnetic Attraction',     icon: '🧲',  trigger: 'hoverCount', threshold: 10 },
    { id: 'speed-demon',   cond: () => true,                              msg: 'Speed Demon Scroll',      icon: '💨',  trigger: 'fastScroll' },
    { id: 'lucky-number',  cond: () => true,                              msg: 'Lucky Number 7 Clicks!',  icon: '🎰',  trigger: 'clickCount', threshold: 7, duplicate: true },
    { id: 'window-watcher',cond: () => true,                              msg: 'Window Watcher',          icon: '👀',  trigger: 'visibilityChange', threshold: 2 }
  ];

  // ---------- Trackers ----------
  let clickCount = 0;
  let hoverCount = 0;
  let keyPressCount = 0;
  let visitedPages = [];
  let lastScrollTime = 0;
  let visibilityChanges = 0;

  // Helper: record page visit
  function recordPageVisit() {
    const current = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    const pages = ['index', 'about', 'projects', 'report', 'contact'];
    if (!pages.includes(current)) return;
    if (!visitedPages.includes(current)) {
      visitedPages.push(current);
      // Check if all 5 visited
      if (visitedPages.length >= pages.length && unlock('full-house')) {
        showToast(achievements.find(a => a.id === 'full-house').msg, achievements.find(a => a.id === 'full-house').icon);
      }
    }
  }

  // ---------- Achievement Unlocking Logic ----------
  // First visit (runs immediately)
  if (unlock('first-visit')) {
    showToast('Welcome, Builder!', '👋');
  }

  // Click events (multiple achievements)
  document.addEventListener('click', () => {
    clickCount++;
    // Click Master
    if (clickCount >= 7 && unlock('click-master')) {
      showToast('Click Master', '🖱️');
    }
    // Lucky Number (exactly 7, only once)
    if (clickCount === 7 && unlock('lucky-number')) {
      showToast('Lucky Number 7 Clicks!', '🎰');
    }
  });

  // Theme change (listening for custom event from theme.js)
  window.addEventListener('themechange', () => {
    if (unlock('theme-changer')) {
      showToast('Theme Sorcerer', '🎨');
    }
  });

  // Scroll to bottom
  let bottomReached = false;
  window.addEventListener('scroll', () => {
    if (!bottomReached && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      bottomReached = true;
      if (unlock('scroll-bottom')) {
        showToast('Scroll to the Depths', '⬇️');
      }
    }

    // Fast scroll detection (speed demon)
    const now = Date.now();
    const delta = now - lastScrollTime;
    if (delta < 50 && window.scrollY > 1000 && unlock('speed-demon')) {
      showToast('Speed Demon Scroll', '💨');
    }
    lastScrollTime = now;
  });

  // Right-click event
  window.addEventListener('contextmenu', () => {
    if (unlock('right-clicker')) {
      showToast('Right‑Click Explorer', '🖱️');
    }
  });

  // Hover count on interactive elements (links, buttons, cards)
  const hoverTargets = 'a, button, .card, .btn, .skill-circle, .about-card, .project-card, .featured-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      hoverCount++;
      if (hoverCount >= 10 && unlock('hover-magnet')) {
        showToast('Magnetic Attraction', '🧲');
      }
    }
  });

  // Keyboard hero (non-input keys)
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
    keyPressCount++;
    if (keyPressCount >= 15 && unlock('keyboard-hero')) {
      showToast('Keyboard Hero', '⌨️');
    }
  });

  // Window watcher (visibility changes)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      visibilityChanges++;
      if (visibilityChanges >= 2 && unlock('window-watcher')) {
        showToast('Window Watcher', '👀');
      }
    }
  });

  // Initialize page visit count
  recordPageVisit();

  // If the user has already visited all pages in session (e.g., hard reload on same page?), re-check
  // We already called recordPageVisit.

})();