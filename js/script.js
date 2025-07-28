import './_loadProjects.js'
import './_modal.js';
import './_theme.js';
import { inicializarTooltips } from './_tooltip.js';
import './_animations.js';
import { inicializarFiltros } from './_filters.js';
import './_plyr-init.js';

import { observarProyectos, resetAnimationIndex } from './_animations.js';
import { cargarProyectos } from './_loadProjects.js';
import { openModal, closeModal, setProyectos } from './_modal.js';

// Ejecutar feather icons y demás scripts cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace();

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
  cargarProyectos((data) => {
    setProyectos(data);
    window.openModal = openModal;
    window.closeModal = closeModal;
    // ⚡ Activar tooltips ahora que los proyectos están cargados
    inicializarTooltips();
    inicializarFiltros();
    resetAnimationIndex();
    observarProyectos();
  });
});