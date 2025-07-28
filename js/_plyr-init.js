// _plyr-init.js

window.player = new Plyr('#modal-video', {
  controls: ['play', 'progress', 'mute', 'fullscreen'],
  fullscreen: { enabled: true, fallback: true }
});

document.addEventListener("DOMContentLoaded", () => {
  const modalVideoElement = document.getElementById('modal-video');
  if (modalVideoElement) {
    player = new Plyr(modalVideoElement, {
      controls: ['play', 'progress', 'mute', 'fullscreen'],
      fullscreen: { enabled: true, fallback: true }
    });
  }
});