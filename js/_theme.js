document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeBtn = document.getElementById("theme-cycle-btn");
  const themes = ["black", "gray", "white"];
  const mainNav = document.querySelector('.main-nav');
  const projects = document.getElementById('projects-container');

  function updateNavbarColor() {
    const isLight = body.classList.contains('bg-white') || body.classList.contains('bg-gray');
    const navHeight = mainNav ? mainNav.offsetHeight : 0;
    const threshold = projects ? projects.offsetTop - navHeight : 0;
    if (isLight && window.scrollY >= threshold) {
      body.classList.add('nav-white');
    } else {
      body.classList.remove('nav-white');
    }
  }

  let currentTheme = localStorage.getItem("theme") || "white";
  applyTheme(currentTheme);
  updateNavbarColor();
  window.addEventListener('scroll', updateNavbarColor);

  themeBtn.addEventListener("click", () => {
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    currentTheme = themes[nextIndex];
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
  });

  function applyTheme(theme) {
    body.classList.remove("bg-white", "bg-gray", "bg-black");

    if (theme === "white") {
      body.classList.add("bg-white");
    } else if (theme === "gray") {
      body.classList.add("bg-gray");
    } else if (theme === "black") {
      body.classList.add("bg-black");
    }
    updateNavbarColor();
  }
});
