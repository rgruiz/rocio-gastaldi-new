export function inicializarFiltros() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const aboutLink = document.querySelector('.about-link');
  const footerSection = document.getElementById('footer');

  filterButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      const selected = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const projects = document.querySelectorAll('.project'); // <- importante: adentro del click

      projects.forEach(project => {
        const tipo = project.dataset.tipo;

        if (selected === 'all' || tipo === selected) {
          project.style.display = '';
          project.style.opacity = 0;
          setTimeout(() => {
            project.style.transition = 'opacity 0.4s ease';
            project.style.opacity = 1;
          }, 10);
        } else {
          project.style.transition = 'opacity 0.4s ease';
          project.style.opacity = 0;
          setTimeout(() => {
            project.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // Scroll suave al footer desde "ABOUT"
  if (aboutLink && footerSection) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      footerSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Scrollspy: activa el link mientras el footer esté visible
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