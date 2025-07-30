export function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  const size = 40;
  const cols = Math.ceil(window.innerWidth / size) + 1;
  const rows = Math.ceil(window.innerHeight / size);

  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.className = 'loader-row' + (r % 2 ? ' offset' : '');
    for (let c = 0; c < cols; c++) {
      const img = document.createElement('img');
      img.src = 'assets/img/x.svg';
      img.className = 'loader-icon';
      row.appendChild(img);
    }
    loader.appendChild(row);
  }

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
