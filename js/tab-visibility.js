// FILE: js/tab-visibility.js
(function() {
  const originalTitle = document.title;
  let hiddenToastShown = false;

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '👋 Come back, Explorer!';
      if (!hiddenToastShown) {
        showToast("We'll keep your seat warm.");
        hiddenToastShown = true;
      }
    } else {
      document.title = originalTitle;
      showToast('✨ Welcome back, Explorer!');
      hiddenToastShown = false;
    }
  });
})();