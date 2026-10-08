// _loadProjects.js
import { initLazyMedia } from './_lazyload.js';
export async function cargarProyectos(callback) {
  const res = await fetch('./data/proyectos.json');
  const data = await res.json();
  window.PROYECTOS = data;
  callback(data);
}

function toCapitalCase(text) {
  if (!text) return "";
  return text.toLowerCase().replace(/(^|[\s+\-/])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase());
}

async function loadProjects() {
const container = document.getElementById("projects-container");
const response = await fetch("./data/proyectos.json");
const proyectos = await response.json();

container.innerHTML = proyectos.map((proyecto, index) => {
    const isDecorative = proyecto.tipo?.toUpperCase() === "DECORATIVE";
    const mainIsVideo = Boolean(proyecto.imagen && proyecto.imagen.endsWith(".mp4"));
    const hoverIsVideo = Boolean(proyecto.imagenHover && proyecto.imagenHover.endsWith(".mp4"));

    const media = mainIsVideo
    ? `<video data-src="${proyecto.imagen}" autoplay muted loop playsinline preload="none"></video>`
    : `<div class="bg-image" data-bg="${proyecto.imagen || ''}"></div>`;

    let hover = "";
    if (proyecto.imagenHover) {
    hover = hoverIsVideo
        ? `<video class="hover-media" data-src="${proyecto.imagenHover}" autoplay muted loop playsinline preload="none"></video>`
        : `<div class="hover-media" data-bg="${proyecto.imagenHover}"></div>`;
    }

    if (isDecorative) {
      return `
      <div class="project project-decorative" data-tipo="DECORATIVE">
        <div class="media-wrapper">
          ${media}
          ${hover}
        </div>
      </div>
      `;
    }

    return `
    <a href="#" class="project" onclick="event.preventDefault(); openModal(${index});"
        data-title="${proyecto.titulo || ''}" data-client="${proyecto.cliente || ''}" data-tipo="${proyecto.tipo || ''}">
        <div class="media-wrapper">
        ${media}
        ${hover}
        </div>
        <div class="overlay-mobile pre-animate">
        <h2>${proyecto.titulo || ''}</h2>
        ${proyecto.cliente ? `<p>${toCapitalCase(proyecto.cliente)}</p>` : ""}
        </div>
    </a>
    `;
}).join("");
}

loadProjects().then(initLazyMedia);


