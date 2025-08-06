document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeBtn = document.getElementById("theme-cycle-btn");
  const themes = ["black", "white"];
  const vimeoIcon = document.querySelector('.vimeo-icon');
  const mainNav = document.querySelector('.main-nav');
  const projects = document.getElementById('projects-container');

  let navHeight = mainNav ? mainNav.offsetHeight : 0;
  let threshold = projects ? projects.offsetTop - navHeight : 0;

  function updateNavbarColor() {
    const isLight = body.classList.contains('bg-white');
    if (isLight && window.scrollY >= threshold) {
      body.classList.add('nav-white');
    } else {
      body.classList.remove('nav-white');
    }
  }

  window.addEventListener('resize', () => {
    navHeight = mainNav ? mainNav.offsetHeight : 0;
    threshold = projects ? projects.offsetTop - navHeight : 0;
    updateNavbarColor();
  });

  let currentTheme = localStorage.getItem("theme") || "white";
  applyTheme(currentTheme);
  updateNavbarColor();
  window.addEventListener('scroll', updateNavbarColor, { passive: true });

  themeBtn.addEventListener("click", () => {
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    currentTheme = themes[nextIndex];
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
  });

  function applyTheme(theme) {
    body.classList.remove("bg-white", "bg-black");

    if (theme === "white") {
      body.classList.add("bg-white");
      vimeoIcon.setAttribute('src', 'assets/img/icons/vimeo.svg');
    } else if (theme === "black") {
      body.classList.add("bg-black");
      vimeoIcon.setAttribute('src', 'assets/img/icons/vimeo-black.svg');
    }
    updateNavbarColor();
  }
});
