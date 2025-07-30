// _lazyload.js
export function loadProjectMedia(project) {
  const video = project.querySelector('video[data-src]');
  if (video && !video.src) {
    video.src = video.dataset.src;
  }
  const hoverVideo = project.querySelector('video.hover-media[data-src]');
  if (hoverVideo && !hoverVideo.src) {
    hoverVideo.src = hoverVideo.dataset.src;
  }
  const bg = project.querySelector('.bg-image[data-bg]');
  if (bg && !bg.style.backgroundImage) {
    bg.style.backgroundImage = `url('${bg.dataset.bg}')`;
  }
  const hoverBg = project.querySelector('.hover-media[data-bg]');
  if (hoverBg && !hoverBg.style.backgroundImage) {
    hoverBg.style.backgroundImage = `url('${hoverBg.dataset.bg}')`;
  }
}

export function initLazyMedia() {
  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadProjectMedia(entry.target);
        projectObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('.project').forEach(p => projectObserver.observe(p));

  const aboutSource = document.querySelector('.about-bg-video source[data-src]');
  if (aboutSource) {
    const aboutObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        aboutSource.src = aboutSource.dataset.src;
        aboutSource.parentElement.load();
        aboutObserver.unobserve(entries[0].target);
      }
    }, { rootMargin: '200px 0px' });
    aboutObserver.observe(aboutSource.parentElement);
  }
}

