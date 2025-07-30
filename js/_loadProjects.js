// _loadProjects.js
export async function cargarProyectos(callback) {
  const response = await fetch('./data/proyectos.json');
  const proyectos = await response.json();
  window.PROYECTOS = proyectos;

  const container = document.getElementById('projects-container');
  container.innerHTML = proyectos.map((proyecto, index) => {
    const mainIsVideo = proyecto.imagen.endsWith('.mp4');
    const hoverIsVideo = proyecto.imagenHover && proyecto.imagenHover.endsWith('.mp4');

    const media = mainIsVideo
      ? `<video data-src="${proyecto.imagen}" autoplay muted loop playsinline preload="none"></video>`
      : `<div class="bg-image" data-bg="${proyecto.imagen}"></div>`;

    let hover = '';
    if (proyecto.imagenHover) {
      hover = hoverIsVideo
        ? `<video class="hover-media" data-src="${proyecto.imagenHover}" autoplay muted loop playsinline preload="none"></video>`
        : `<div class="hover-media" data-bg="${proyecto.imagenHover}"></div>`;
    }

    return `
    <a href="#" class="project project-${proyecto.size.replace('/', '-')}" onclick="openModal(${index})"
        data-title="${proyecto.titulo}" data-client="${proyecto.cliente}" data-tipo="${proyecto.tipo}">
        <div class="media-wrapper">
        ${media}
        ${hover}
        </div>
        <div class="overlay-mobile pre-animate">
        <h2>${proyecto.titulo}</h2>
        ${proyecto.cliente ? `<p>${proyecto.cliente}</p>` : ''}
        </div>
    </a>
    `;
  }).join('');

  callback(proyectos);
}
