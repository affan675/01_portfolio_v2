// FILE: js/counters.js
(function() {
  const skillValues = document.querySelectorAll('.skill-value');
  const skillCircles = document.querySelectorAll('.skill-circle');

  function animateCircle(circle, percent) {
    const ring = circle.querySelector('.progress-ring');
    if (!ring) return;
    const circumference = 2 * Math.PI * 52;
    ring.style.strokeDasharray = circumference;
    const offset = circumference - (percent / 100) * circumference;
    ring.style.strokeDashoffset = offset;
  }

  function animateCounters() {
    skillCircles.forEach(circle => {
      const percent = parseInt(circle.getAttribute('data-percent'), 10);
      const valueEl = circle.querySelector('.skill-value');
      if (valueEl && valueEl.textContent === '0%') {
        let start = 0;
        const duration = 1500;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = percent / steps;
        const timer = setInterval(() => {
          start += increment;
          if (start >= percent) {
            start = percent;
            clearInterval(timer);
          }
          valueEl.textContent = Math.floor(start) + '%';
        }, stepTime);
      }
      animateCircle(circle, percent);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const firstCircle = document.querySelector('.skill-circle');
  if (firstCircle) observer.observe(firstCircle);
  else animateCounters();
})();