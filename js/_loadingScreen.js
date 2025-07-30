export function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  loader.style.backgroundImage = "url('assets/img/x.svg')";
  loader.style.backgroundRepeat = 'repeat';
  loader.style.backgroundSize = '40px 40px';

  const text = document.createElement('div');
  text.className = 'loader-text';
  text.textContent = 'ROCIO GASTALDI';
  loader.appendChild(text);

  // Fallback hide after 10s
  setTimeout(hideLoadingScreen, 10000);
}

export function hideLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.remove();
      document.dispatchEvent(new Event('loadingScreenHidden'));
    }, 500);
  } else {
    document.dispatchEvent(new Event('loadingScreenHidden'));
  }
}

export function monitorFirstProjects(count) {
  const projects = document.querySelectorAll('.project');
  const targets = Array.from(projects).slice(0, count);
  if (targets.length === 0) {
    hideLoadingScreen();
    return;
  }
  let remaining = targets.length;

  targets.forEach(proj => {
    const video = proj.querySelector('video');
    const bg = proj.querySelector('.bg-image');

    if (video) {
      if (video.readyState >= 2) check();
      else video.addEventListener('loadeddata', check, { once: true });
    } else if (bg) {
      const url = bg.style.backgroundImage || `url('${bg.dataset.bg}')`;
      const match = url.match(/url\(["']?(.*?)["']?\)/);
      const src = match ? match[1] : bg.dataset.bg;
      const img = new Image();
      img.onload = check;
      img.src = src;
    } else {
      check();
    }
  });

  function check() {
    remaining--;
    if (remaining <= 0) hideLoadingScreen();
  }
}
