// FILE: js/preloader.js
(function() {
  const preloader = document.getElementById('preloader');
  const blastOverlay = document.getElementById('blast-overlay');
  const blastParticles = document.getElementById('blast-particles');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const mainContent = document.getElementById('main-content');

  if (!preloader || !progressBar || !progressText || !mainContent) return;

  const duration = 2000; // 2 seconds
  const interval = 40;
  const steps = duration / interval;
  let currentStep = 0;
  let blastTriggered = false;

  const timer = setInterval(() => {
    currentStep++;
    const percentage = Math.min(Math.round((currentStep / steps) * 100), 100);
    progressBar.style.width = percentage + '%';
    progressText.textContent = percentage + '%';

    if (percentage >= 100 && !blastTriggered) {
      blastTriggered = true;
      clearInterval(timer);
      triggerSuperBlast();
    }
  }, interval);

  function triggerSuperBlast() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';

    // 1. Intense flash
    blastOverlay.classList.add('flash-super');

    // 2. Shake the preloader card
    const card = preloader.querySelector('.preloader-card');
    if (card) {
      card.classList.add('shake');
    }

    // 3. Shockwave ring
    const ring = document.createElement('div');
    ring.className = 'shockwave-ring';
    document.body.appendChild(ring);
    requestAnimationFrame(() => ring.classList.add('active'));

    // 4. Spawn many blast particles (⚡ and 💥)
    if (blastParticles) {
      spawnSuperParticles(theme);
    }

    // 5. After short delay, fade everything and reveal content
    setTimeout(() => {
      blastOverlay.classList.remove('flash-super');
      blastOverlay.classList.add('fade-out-flash');
    }, 180);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      mainContent.classList.remove('content-hidden');
      mainContent.classList.add('content-visible');
    }, 400);

    // Cleanup
    setTimeout(() => {
      blastOverlay.classList.remove('fade-out-flash');
      if (ring.parentNode) ring.remove();
      if (blastParticles) blastParticles.innerHTML = '';
    }, 1100);
  }

  function spawnSuperParticles(theme) {
    if (!blastParticles) return;
    const fragment = document.createDocumentFragment();
    const emojis = ['⚡', '💥', '✨', '⚡', '💥', '⚡', '💫', '⚡'];
    const count = 28; // more particles

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.classList.add('blast-particle');
      // Random emoji
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      // Random angle and distance
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const distance = 70 + Math.random() * 140;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      // Random size
      const size = 1.2 + Math.random() * 2.8;
      particle.style.fontSize = size + 'rem';
      // Color for tech theme
      if (theme === 'tech') {
        particle.style.color = Math.random() < 0.5 ? '#00ffff' : '#ff00ff';
        particle.style.textShadow = '0 0 10px currentColor';
      }
      // Custom properties for animation
      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
      // Position at center of screen
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      // Animation with random delay
      particle.style.animation = `particleBurst 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
      particle.style.animationDelay = Math.random() * 0.15 + 's';
      fragment.appendChild(particle);
    }
    blastParticles.appendChild(fragment);
  }

  // Add the keyframe for particle burst if not already present
  if (!document.getElementById('blast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'blast-keyframes';
    style.textContent = `
      @keyframes particleBurst {
        0% {
          transform: translate(-50%, -50%) translate(0, 0) scale(0.3);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();