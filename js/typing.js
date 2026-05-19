// FILE: js/typing.js (complete)
(function() {
  const typingText = document.getElementById('typingText');
  if (!typingText) return;

  const words = ['Polymath', 'Web Developer', 'Builder'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 120;
  let deleteSpeed = 60;
  let pauseBetween = 1800;

  function typeLoop() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, deleteSpeed);
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseBetween);
        return;
      }
      setTimeout(typeLoop, typeSpeed);
    }
  }

  setTimeout(typeLoop, 600);
})();