if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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

function initNavScroll() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const TOP_THRESHOLD = 50;
  const SCROLL_DELTA = 6;

  function updateNav() {
    if (document.body.classList.contains('scroll-locked')) {
      ticking = false;
      return;
    }

    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;

    if (currentScrollY <= TOP_THRESHOLD) {
      nav.classList.remove('nav-hidden');
      nav.classList.remove('nav-scrolled');
    } else if (diff > SCROLL_DELTA) {
      nav.classList.add('nav-hidden');
      nav.classList.add('nav-scrolled');
    } else if (diff < -SCROLL_DELTA) {
      nav.classList.remove('nav-hidden');
      nav.classList.add('nav-scrolled');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
}

// Ejecutar feather icons y demás scripts cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace();

  initLoadingScreen();
  initAboutLink();
  initNavScroll();

  const logoLink = document.querySelector('.main-nav .logo a');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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
