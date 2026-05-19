// FILE: js/particle.js
(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let particlesArray = [];
  const particleCount = 80;

  // ----- Resize canvas -----
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ----- Particle class -----
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedX = (Math.random() * 1.2 - 0.6) * 0.8;
      this.speedY = (Math.random() * 1.2 - 0.6) * 0.8;
      this.color = Math.random() < 0.5 ? '#00ffff' : '#ff00ff'; // cyan / magenta
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ----- Create particles -----
  function createParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }
  }

  // ----- Draw connecting lines -----
  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = '#00ffff';
          ctx.globalAlpha = 0.15 * (1 - dist / maxDist);
          ctx.lineWidth = 0.6;
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // ----- Animation loop -----
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  // ----- Start / Stop -----
  function startParticles() {
    if (animationId) return; // already running
    createParticles();
    canvas.style.display = 'block';
    animate();
  }

  function stopParticles() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
    particlesArray = [];
  }

  // ----- Listen to theme changes -----
  function handleThemeChange(theme) {
    if (theme === 'tech') {
      startParticles();
    } else {
      stopParticles();
    }
  }

  window.addEventListener('themechange', (e) => handleThemeChange(e.detail.theme));

  // Initial check
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  handleThemeChange(currentTheme);
})();