// FILE: js/particles-config.js
(function () {
  'use strict';

  const container = document.getElementById('particles-js');
  if (!container) return;

  let particlesInitialised = false;

  const config = {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 800 } },
      color: { value: '#00ffff' },
      shape: { type: 'circle' },
      opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.5, sync: false } },
      line_linked: { enable: true, distance: 150, color: '#ff00ff', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1.5, direction: 'none', random: true, straight: false, out_mode: 'bounce', attract: { enable: true, rotateX: 500, rotateY: 1100 } }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 180, line_linked: { opacity: 0.6 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  };

  function init() {
    if (typeof particlesJS === 'undefined') {
      console.warn('particles.js not loaded yet – retrying in 200ms');
      setTimeout(init, 200);
      return;
    }
    if (!particlesInitialised) {
      container.style.display = 'block';
      particlesJS('particles-js', config);
      particlesInitialised = true;
    }
  }

  function destroy() {
    if (particlesInitialised) {
      // particles.js doesn't offer a destroy method, so we remove its canvas
      const canvas = container.querySelector('canvas');
      if (canvas) canvas.remove();
      container.style.display = 'none';
      particlesInitialised = false;
    }
  }

  function handleThemeChange(theme) {
    if (theme === 'tech') {
      init();
    } else {
      destroy();
    }
  }

  // Listen to our custom theme-change event (emitted by theme.js)
  window.addEventListener('themechange', function (e) {
    handleThemeChange(e.detail.theme);
  });

  // Check current theme on page load
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  handleThemeChange(currentTheme);
})();