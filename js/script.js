import { openModal, closeModal, setProyectos } from './_modal.js';
import './_theme.js';
import { inicializarTooltips } from './_tooltip.js';
import { observarProyectos, resetAnimationIndex } from './_animations.js';
import { inicializarFiltros } from './_filters.js';
import './_plyr-init.js';
import { initLazyMedia, loadProjectMedia } from './_lazyload.js';

import { showLoadingScreen, hideLoadingScreen } from './_loadingScreen.js';
import { cargarProyectos } from './_loadProjects.js';

function preloadInitialMedia(count = 4) {
  const projects = Array.from(document.querySelectorAll('.project')).slice(0, count);
  const promises = projects.map(proj => {
    loadProjectMedia(proj);
    const video = proj.querySelector('video');
    if (video) {
      return new Promise(res => {
        if (video.readyState >= 2) return res();
        video.addEventListener('loadeddata', res, { once: true });
      });
    }
    const bg = proj.querySelector('.bg-image');
    if (bg) {
      return new Promise(res => {
        const img = new Image();
        img.onload = res;
        img.src = bg.dataset.bg;
      });
    }
    return Promise.resolve();
  });
  return Promise.all(promises);
}

// Ejecutar feather icons y demás scripts cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace();
  showLoadingScreen();

  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Cargar proyectos y exponer funciones globales
  cargarProyectos(async (data) => {
    setProyectos(data);
    window.openModal = openModal;
    window.closeModal = closeModal;
    // ⚡ Activar tooltips ahora que los proyectos están cargados
    inicializarTooltips();
    inicializarFiltros();
    resetAnimationIndex();
    observarProyectos();
    initLazyMedia();
    await preloadInitialMedia(4);
    hideLoadingScreen();
  });
});


