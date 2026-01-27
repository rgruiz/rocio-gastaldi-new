// _cursor.js

export function initCursor() {
    // Only initialize on desktop/hover-capable devices
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.getElementById("cursor-follower");
    if (!cursor) return;

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animate() {
        // Linear interpolation for smooth following
        const dt = 0.2; // ease factor
        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animate);
    }
    animate();

    // Handle project hover
    const setupProjectHover = () => {
        const projects = document.querySelectorAll(".project");

        projects.forEach(project => {
            const title = project.getAttribute("data-title") || "";
            const client = project.getAttribute("data-client") || "";

            project.addEventListener("mouseenter", () => {
                cursor.innerHTML = `
          <div class="cursor-text-title">${title}</div>
          <div class="cursor-text-client">${client}</div>
        `;
                cursor.classList.add("active");
            });

            project.addEventListener("mouseleave", () => {
                cursor.classList.remove("active");
                // Clear content after transition to avoid popping? 
                // Better keep it until next hover or just let opacity handle it.
            });
        });
    };

    // Setup listeners initially
    setupProjectHover();

    // If projects are loaded dynamically later, we might need to re-run setup 
    // or use event delegation. Event delegation is safer for dynamic content.
    // Converting to delegation:
    const container = document.getElementById("projects-container");
    if (container) {
        container.addEventListener("mouseover", (e) => {
            const project = e.target.closest(".project");
            if (project) {
                const title = project.getAttribute("data-title") || "";
                const client = project.getAttribute("data-client") || "";

                // Only update if content changed to avoid flicker (optional optimization)
                const newContent = `
          <div class="cursor-text-title">${title}</div>
          <div class="cursor-text-client">${client}</div>
        `;
                if (cursor.innerHTML !== newContent) {
                    cursor.innerHTML = newContent;
                }

                cursor.classList.add("active");
            } else {
                cursor.classList.remove("active");
            }
        });

        // Mouseout from container could be tricky if it fires when entering child.
        // Better to use mouseover/mouseout on container with specific checks.

        container.addEventListener("mouseout", (e) => {
            const project = e.target.closest(".project");
            // If we moved out of a project and not into another child of it?
            // simplistic check: if relatedTarget is not within a project, deactivate.
            if (project && !project.contains(e.relatedTarget)) {
                cursor.classList.remove("active");
            }
        });
    }
}
