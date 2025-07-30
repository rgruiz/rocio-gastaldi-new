// _loadingScreen.js
export function showLoadingScreen() {
  const overlay = document.getElementById('loading-screen');
  if (!overlay) return;

  const size = 40;
  const cols = Math.ceil(window.innerWidth / size);
  const rows = Math.ceil(window.innerHeight / size);
  overlay.style.display = 'grid';
  overlay.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  overlay.style.gridAutoRows = `${size}px`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      tile.className = 'loading-tile';
      if (r % 2) tile.classList.add('offset');
      tile.style.animationDelay = `${Math.random() * 2}s`;
      overlay.appendChild(tile);
    }
  }
}

export function hideLoadingScreen() {
  const overlay = document.getElementById('loading-screen');
  if (overlay) {
    overlay.classList.add('hide');
    setTimeout(() => overlay.remove(), 500);
  }
}
