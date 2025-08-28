// _modal.js

let proyectos = [];
export function setProyectos(data) {
  proyectos = data;
}
let currentIndex = 0;
let player;

function lockBodyScroll() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  document.body.dataset.scrollLockY = String(scrollY);
  document.body.classList.add('scroll-locked');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
}

function unlockBodyScroll() {
  const y = parseInt(document.body.dataset.scrollLockY || '0', 10) || 0;
  document.body.classList.remove('scroll-locked');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  delete document.body.dataset.scrollLockY;
  window.scrollTo(0, y);
}

export function openModal(index) {
  currentIndex = index;
  const proyecto = proyectos[index];
  const prevIndex = (index - 1 + proyectos.length) % proyectos.length;
  const nextIndex = (index + 1) % proyectos.length;
  const vimeoId = proyecto.video.split('/').pop();

  const wrapper = document.getElementById("modal-video-wrapper");
  wrapper.innerHTML = `
    <div class="plyr__video-embed"
         data-plyr-provider="vimeo"
         data-plyr-embed-id="${vimeoId}">
    </div>
  `;

  setTimeout(() => {
    if (window.player) {
      window.player.destroy();
    }

    const embedElement = wrapper.querySelector('.plyr__video-embed');
    window.player = new Plyr(embedElement, {
      controls: ['play', 'progress', 'mute', 'fullscreen'],
      hideControls: true,
      fullscreen: { enabled: true, fallback: true },
      autoplay: true,
      muted: false,
      vimeo: {
        controls: false,
        byline: false,
        portrait: false,
        title: false,
        playsinline: true
      }
    });
  }, 50);

  const prevProyecto = proyectos[prevIndex];
  const nextProyecto = proyectos[nextIndex];

  document.getElementById("modal-title").innerText = proyecto.titulo + "\n" + proyecto.cliente;
  document.getElementById("modal-description").innerText = proyecto.descripcion;
  document.getElementById("prev-label").innerText = `${prevProyecto.titulo}${prevProyecto.cliente ? ' · ' + prevProyecto.cliente : ''}`;
  document.getElementById("next-label").innerText = `${nextProyecto.titulo}${nextProyecto.cliente ? ' · ' + nextProyecto.cliente : ''}`;

  const modal = document.getElementById("project-modal");
  if (proyecto.tipo === "VIDEO" || proyecto.tipo === "COMMERCIAL") {
    modal.classList.add("video-only");
  } else {
    modal.classList.remove("video-only");
  }
  // Special handling for portrait-shot asset (jala-jala)
  if (proyecto.id === "jala-jala") {
    modal.classList.add("portrait-asset");
  } else {
    modal.classList.remove("portrait-asset");
  }
  lockBodyScroll();
  modal.style.display = "flex";
}

export function closeModal() {
  window.player?.stop();
  document.getElementById("project-modal").style.display = "none";
  unlockBodyScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prev-project").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + proyectos.length) % proyectos.length;
    openModal(currentIndex);
  });

  document.getElementById("next-project").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % proyectos.length;
    openModal(currentIndex);
  });

  // Inicializa un player vacío por defecto para evitar errores al cerrar el modal sin video
  player = new Plyr('#modal-video', {
    controls: ['play', 'progress', 'mute', 'fullscreen'],
    hideControls: true,
    fullscreen: { enabled: true, fallback: true },
    vimeo: {
      controls: false,
      byline: false,
      portrait: false,
      title: false,
      playsinline: true
    }
  });

  // Keyboard support: Esc to close, arrows to navigate when nav is visible
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('project-modal');
    const isOpen = modal && modal.style.display === 'flex';
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    // Only allow arrow navigation when the info/nav is visible (not in video-only)
    const videoOnly = modal.classList.contains('video-only');
    if (!videoOnly) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % proyectos.length;
        openModal(currentIndex);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + proyectos.length) % proyectos.length;
        openModal(currentIndex);
      }
    }
  });
});
