// FILE: js/cursor.js
(function() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let targetRingX = -100;
  let targetRingY = -100;
  let isHovering = false;
  let magneticTarget = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    targetRingX = mouseX;
    targetRingY = mouseY;

    if (magneticTarget && isHovering) {
      const rect = magneticTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pullStrength = 0.25;
      targetRingX = mouseX + (centerX - mouseX) * pullStrength;
      targetRingY = mouseY + (centerY - mouseY) * pullStrength;
    }
  });

  function animateRing() {
    ringX += (targetRingX - ringX) * 0.22;
    ringY += (targetRingY - ringY) * 0.22;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll('a, button, .card, .btn, input, textarea, .theme-btn, .hamburger, .skill-circle, .social-links a, .project-card, .about-card, .featured-card');
  
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      isHovering = true;
      dot.classList.add('hovering');
      ring.classList.add('hovering');
      if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('theme-btn')) {
        magneticTarget = el;
      }
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      magneticTarget = null;
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
      targetRingX = mouseX;
      targetRingY = mouseY;
    });
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();