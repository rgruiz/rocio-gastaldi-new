export function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  // Skip the loader if we've loaded the site before
  if (localStorage.getItem('skipLoadingScreen') === '1') {
    hideLoadingScreen();
    return;
  }

  const textEl = document.createElement('div');
  textEl.className = 'loader-text';
  loader.appendChild(textEl);

  const content = 'ROCIO GASTALDI';
  let index = 0;
  (function type() {
    textEl.textContent = content.slice(0, index);
    if (index++ < content.length) {
      setTimeout(type, 100);
    }
  })();

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
  // Mark that we've shown the loader once
  localStorage.setItem('skipLoadingScreen', '1');
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
