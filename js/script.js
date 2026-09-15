import './_loadProjects.js'
import './_modal.js';
import { initCursor } from './_cursor.js';
import './_animations.js';
import './_plyr-init.js';
import { initLazyMedia } from './_lazyload.js';
import { initLoadingScreen, monitorFirstProjects } from './_loadingScreen.js';

import { observarProyectos, resetAnimationIndex } from './_animations.js';
import { cargarProyectos } from './_loadProjects.js';
import { openModal, closeModal, setProyectos } from './_modal.js';

function initAboutLink() {
  const aboutLink = document.querySelector('.about-link');
  const footerSection = document.getElementById('footer');

  if (aboutLink && footerSection) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      footerSection.scrollIntoView({ behavior: 'smooth' });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutLink.classList.add('active');
        } else {
          aboutLink.classList.remove('active');
        }
      });
    }, {
      threshold: 0.05
    });

    observer.observe(footerSection);
  }
}

// Ejecutar feather icons y demás scripts cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace();

  initLoadingScreen();
  initAboutLink();

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

  // Iniciar cursor personalizado cuando desaparezca la pantalla de carga
  document.addEventListener('loadingScreenHidden', initCursor, { once: true });

  // Cargar proyectos y exponer funciones globales
  cargarProyectos((data) => {
    setProyectos(data);
    window.openModal = openModal;
    window.closeModal = closeModal;
    resetAnimationIndex();
    observarProyectos();
    initLazyMedia();
    monitorFirstProjects(5);
  });
});
