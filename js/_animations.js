// _animations.js
let animationIndex = 0;

document.addEventListener("DOMContentLoaded", () => {

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // solo animar una vez
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  const projects = document.querySelectorAll(".project");
  projects.forEach(project => observer.observe(project));

  //footer
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
});

// Al final de _animations.js
export function observarProyectos() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".project").forEach(p => {
    if (!p.classList.contains("visible")) {
      observer.observe(p);
    }
  });
}

export function resetAnimationIndex() {
  animationIndex = 0;
}

window.resetAnimationIndex = resetAnimationIndex;