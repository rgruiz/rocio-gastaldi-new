export function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

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
}

export function resourcesLoadedFromCache(urls) {
  const entries = performance.getEntriesByType('resource');
  return urls.every(u => {
    try {
      const abs = new URL(u, location.href).href;
      const entry = entries.find(e => e.name === abs);
      return entry && entry.transferSize === 0;
    } catch {
      return false;
    }
  });
}

export function shouldSkipLoadingScreen(projects) {
  const urls = [];
  projects.forEach(p => {
    if (p.imagen) urls.push(p.imagen);
    if (p.imagenHover) urls.push(p.imagenHover);
  });
  if (urls.length === 0) return false;
  return resourcesLoadedFromCache(urls);
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
