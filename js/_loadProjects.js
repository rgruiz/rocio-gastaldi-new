// _loadProjects.js
export async function cargarProyectos(callback) {
  const res = await fetch('./data/proyectos.json');
  const data = await res.json();
  window.PROYECTOS = data;
  callback(data);
}

async function loadProjects() {
const container = document.getElementById("projects-container");
const response = await fetch("./data/proyectos.json");
const proyectos = await response.json();

container.innerHTML = proyectos.map((proyecto, index) => {
    const mainIsVideo = proyecto.imagen.endsWith(".mp4");
    const hoverIsVideo = proyecto.imagenHover && proyecto.imagenHover.endsWith(".mp4");

    const media = mainIsVideo
    ? `<video src="${proyecto.imagen}" autoplay muted loop playsinline></video>`
    : `<div class="bg-image" style="background-image: url('${proyecto.imagen}')"></div>`;

    let hover = "";
    if (proyecto.imagenHover) {
    hover = hoverIsVideo
        ? `<video class="hover-media" src="${proyecto.imagenHover}" autoplay muted loop playsinline></video>`
        : `<div class="hover-media" style="background-image: url('${proyecto.imagenHover}')"></div>`;
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
        ${proyecto.cliente ? `<p>${proyecto.cliente}</p>` : ""}
        </div>
    </a>
    `;
}).join("");
}

loadProjects();