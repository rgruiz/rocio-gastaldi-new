const PRELOAD_COUNT = 12;

fetch('./data/proyectos.json')
  .then(res => res.json())
  .then(data => {
    data.slice(0, PRELOAD_COUNT).forEach(proyecto => {
      [proyecto.imagen, proyecto.imagenHover].filter(Boolean).forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = src.endsWith('.mp4') ? 'video' : 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    });
  })
  .catch(() => { /* ignore preload errors */ });
