// _lazyload.js
export function initLazyMedia() {
  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target.querySelector('video[data-src]');
        if (video && !video.src) {
          video.src = video.dataset.src;
        }
        const hoverVideo = entry.target.querySelector('video.hover-media[data-src]');
        if (hoverVideo && !hoverVideo.src) {
          hoverVideo.src = hoverVideo.dataset.src;
        }
        const bg = entry.target.querySelector('.bg-image[data-bg]');
        if (bg) {
          bg.style.backgroundImage = `url('${bg.dataset.bg}')`;
        }
        const hoverBg = entry.target.querySelector('.hover-media[data-bg]');
        if (hoverBg) {
          hoverBg.style.backgroundImage = `url('${hoverBg.dataset.bg}')`;
        }
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

