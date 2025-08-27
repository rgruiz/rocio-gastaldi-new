document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeBtn = document.getElementById("theme-cycle-btn");
  const themes = ["black", "white"];
  const mainNav = document.querySelector('.main-nav');
  const projects = document.getElementById('projects-container');

  let navHeight = mainNav ? mainNav.offsetHeight : 0;
  let threshold = projects ? projects.offsetTop - navHeight + 100 : 100;

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
    threshold = projects ? projects.offsetTop - navHeight + 50 : 50;
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
      body.classList.add("bg-white");      // Add a 100px offset so the color changes after scrolling past the projects section
      let threshold = projects ? projects.offsetTop - navHeight + 50 : 50;
    } else if (theme === "black") {
      body.classList.add("bg-black");
    }
    updateNavbarColor();
  }
});
