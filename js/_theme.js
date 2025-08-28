document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeBtn = document.getElementById("theme-cycle-btn");
  const themeBtnMobile = document.getElementById("theme-cycle-btn-mobile");
  const themes = ["black", "white"];
  const mainNav = document.querySelector('.main-nav');
  const mainNavMobile = document.querySelector('.main-nav-mobile');
  const projects = document.getElementById('projects-container');

  function getNavHeight() {
    // Usar el navbar visible según el viewport
    if (window.matchMedia("(max-width: 768px)").matches && mainNavMobile) {
      // Si offsetHeight es 0, usar un valor fijo (ajusta según tu diseño)
      const h = mainNavMobile.offsetHeight;
      return h > 0 ? h : 56;
    }
    return mainNav ? mainNav.offsetHeight : 0;
  }

  function getThreshold() {
    const navHeight = getNavHeight();
    return projects ? projects.offsetTop - navHeight + 100 : 100;
  }

  function updateNavbarColor() {
    const isLight = body.classList.contains('bg-white');
    const threshold = getThreshold();
    if (isLight && window.scrollY >= threshold) {
      body.classList.add('nav-white');
    } else {
      body.classList.remove('nav-white');
    }
  }

  window.addEventListener('resize', updateNavbarColor);

  let currentTheme = localStorage.getItem("theme") || "white";
  applyTheme(currentTheme);
  updateNavbarColor();
  window.addEventListener('scroll', updateNavbarColor, { passive: true });

  // Función para cambiar el theme y sincronizar ambos botones
  function handleThemeToggle() {
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    currentTheme = themes[nextIndex];
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
  }

  // Asignar eventos a ambos botones si existen
  if (themeBtn) {
    themeBtn.addEventListener("click", handleThemeToggle);
  }
  if (themeBtnMobile) {
    themeBtnMobile.addEventListener("click", handleThemeToggle);
  }

  function applyTheme(theme) {
    body.classList.remove("bg-white", "bg-black");
    if (theme === "white") {
      body.classList.add("bg-white");
    } else if (theme === "black") {
      body.classList.add("bg-black");
    }
    // Sincronizar visualmente ambos botones (opcional, si hay estilos .active)
    if (themeBtn) {
      themeBtn.classList.toggle("active", theme === "white");
    }
    if (themeBtnMobile) {
      themeBtnMobile.classList.toggle("active", theme === "white");
    }
    updateNavbarColor();
  }
});
