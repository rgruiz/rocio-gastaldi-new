// _modal.js

let proyectos = [];
export function setProyectos(data) {
  proyectos = data;
}
let currentIndex = 0;
let player;

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
      fullscreen: { enabled: true, fallback: true },
      autoplay: true,
      muted: true
    });
  }, 50);

  const prevProyecto = proyectos[prevIndex];
  const nextProyecto = proyectos[nextIndex];

  document.getElementById("modal-title").innerText = proyecto.titulo + "\n" + proyecto.cliente;
  document.getElementById("modal-description").innerText = proyecto.descripcion;
  document.getElementById("prev-label").innerText = `${prevProyecto.titulo}${prevProyecto.cliente ? ' · ' + prevProyecto.cliente : ''}`;
  document.getElementById("next-label").innerText = `${nextProyecto.titulo}${nextProyecto.cliente ? ' · ' + nextProyecto.cliente : ''}`;

  document.getElementById("project-modal").style.display = "flex";
}

export function closeModal() {
  window.player?.stop();
  document.getElementById("project-modal").style.display = "none";
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
    fullscreen: { enabled: true, fallback: true }
  });
});