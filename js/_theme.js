document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeBtn = document.getElementById("theme-cycle-btn");
  const themes = ["black", "gray", "white"];

  let currentTheme = localStorage.getItem("theme") || "white";
  applyTheme(currentTheme);

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
  }
});