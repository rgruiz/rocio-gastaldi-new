// _modal.js

let proyectos = [];
export function setProyectos(data) {
  proyectos = data;
}
let currentIndex = 0;
let player;
const creativeState = {
  assets: [],
  lastLoadedImages: [],
  index: 0
};

const creativeElements = {
  wrapper: null,
  title: null,
  meta: null,
  track: null,
  dots: null
};

let creativeScrollTicking = false;
const proyectoAssetsDimensions = {};

let prevButton;
let nextButton;
let prevLabel;
let nextLabel;

function isCreative(proyecto) {
  return proyecto?.tipo === 'CREATIVE';
}

function findNextCreativeIndex(fromIndex) {
  if (!proyectos.length) return null;
  let idx = fromIndex;
  do {
    idx = (idx + 1) % proyectos.length;
    if (isCreative(proyectos[idx])) return idx;
  } while (idx !== fromIndex);
  return null;
}

function findPrevCreativeIndex(fromIndex) {
  if (!proyectos.length) return null;
  let idx = fromIndex;
  do {
    idx = (idx - 1 + proyectos.length) % proyectos.length;
    if (isCreative(proyectos[idx])) return idx;
  } while (idx !== fromIndex);
  return null;
}

function formatCreativeLabel(index) {
  const proyecto = proyectos[index];
  if (!proyecto) return '';
  const client = proyecto.cliente ? ` · ${proyecto.cliente}` : '';
  return `${proyecto.titulo}${client}`;
}

function clearCreativeNav() {
  if (!prevButton || !nextButton || !prevLabel || !nextLabel) return;
  prevButton.dataset.targetIndex = '';
  nextButton.dataset.targetIndex = '';
  prevButton.disabled = true;
  nextButton.disabled = true;
  prevLabel.textContent = '';
  nextLabel.textContent = '';
}

function updateCreativeNav(index) {
  if (!prevButton || !nextButton || !prevLabel || !nextLabel) return;
  const prevIndex = findPrevCreativeIndex(index);
  const nextIndex = findNextCreativeIndex(index);

  if (prevIndex === null) {
    prevButton.dataset.targetIndex = '';
    prevButton.disabled = true;
    prevLabel.textContent = '';
  } else {
    prevButton.dataset.targetIndex = String(prevIndex);
    prevButton.disabled = false;
    prevLabel.textContent = 'PREVIOUS';
  }

  if (nextIndex === null) {
    nextButton.dataset.targetIndex = '';
    nextButton.disabled = true;
    nextLabel.textContent = '';
  } else {
    nextButton.dataset.targetIndex = String(nextIndex);
    nextButton.disabled = false;
    nextLabel.textContent = 'NEXT';
  }
}

function isTrackVertical() {
  return creativeElements.track?.classList.contains('vertical');
}

function applyTrackOrientation() {
  const track = creativeElements.track;
  if (!track) return false;
  const shouldBeVertical = window.matchMedia('(max-width: 768px)').matches;
  const wasVertical = track.classList.contains('vertical');
  if (shouldBeVertical === wasVertical) {
    return false;
  }
  track.classList.toggle('vertical', shouldBeVertical);
  track.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  return true;
}

function getRelativeOffset(slide, vertical) {
  const track = creativeElements.track;
  if (!track || !slide) return 0;
  if (vertical) {
    return slide.offsetTop;
  }

  const baseOffset = slide.offsetLeft;
  const slideWidth = slide.offsetWidth;
  const trackWidth = track.clientWidth;
  const peek = trackWidth * 0.08;

  const prevSibling = slide.previousElementSibling;
  const nextSibling = slide.nextElementSibling;

  const availablePrev = prevSibling
    ? baseOffset - (prevSibling.offsetLeft + prevSibling.offsetWidth)
    : baseOffset;

  const totalWidth = track.scrollWidth;
  const slideRight = baseOffset + slideWidth;
  const availableNext = nextSibling
    ? nextSibling.offsetLeft - slideRight
    : totalWidth - slideRight;

  const leftPeek = Math.min(peek, Math.max(availablePrev, 0));
  const rightPeek = Math.min(peek, Math.max(availableNext, 0));

  let target = baseOffset - leftPeek;
  const maxScroll = track.scrollWidth - trackWidth;
  target = Math.max(0, Math.min(target, maxScroll));

  // Ensure right peek when possible
  const remainingWindow = trackWidth - slideWidth - leftPeek;
  if (remainingWindow < rightPeek) {
    const adjustment = rightPeek - remainingWindow;
    target = Math.max(0, Math.min(target - adjustment, maxScroll));
  }

  return target;
}

function lockBodyScroll() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  document.body.dataset.scrollLockY = String(scrollY);
  document.body.classList.add('scroll-locked');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
}

function unlockBodyScroll() {
  const y = parseInt(document.body.dataset.scrollLockY || '0', 10) || 0;
  document.body.classList.remove('scroll-locked');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  delete document.body.dataset.scrollLockY;
  window.scrollTo(0, y);
}

function destroyInstance(instance) {
  if (instance && typeof instance.destroy === 'function') {
    instance.destroy();
  }
}

function destroyPlayerIfExists() {
  if (window.player) {
    destroyInstance(window.player);
  }
  if (player && player !== window.player) {
    destroyInstance(player);
  }
  window.player = null;
  player = null;
}

function preloadImages(srcs) {
  const promises = srcs.map(src => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // Resolve null on error to not block
    });
  });
  return Promise.all(promises);
}

function getMajorityHeight(images) {
  const validImages = images.filter(img => img && img.naturalHeight > 0);
  if (!validImages.length) return null;

  // Count occurrences of each height
  const heightCounts = {};
  validImages.forEach(img => {
    const h = img.naturalHeight;
    heightCounts[h] = (heightCounts[h] || 0) + 1;
  });

  // Find the height with the most occurrences
  let maxCount = 0;
  let majorityHeight = null;
  for (const [h, count] of Object.entries(heightCounts)) {
    if (count > maxCount) {
      maxCount = count;
      majorityHeight = Number(h);
    }
  }

  return majorityHeight;
}

function updateCarouselHeight() {
  const track = creativeElements.track;
  if (!track) return;

  // On mobile/vertical, reset height
  if (isTrackVertical()) {
    track.style.removeProperty('--creative-target-height');
    return;
  }

  const images = creativeState.lastLoadedImages;
  if (!images || !images.length) return;

  const majorityHeight = getMajorityHeight(images);
  if (!majorityHeight) {
    track.style.removeProperty('--creative-target-height');
    return;
  }

  // Calculate constraint: Max width should be ~85% of track width
  let maxAspectRatio = 0;
  images.forEach(img => {
    if (img.naturalHeight > 0) {
      const ar = img.naturalWidth / img.naturalHeight;
      if (ar > maxAspectRatio) maxAspectRatio = ar;
    }
  });

  if (maxAspectRatio === 0) {
    track.style.setProperty('--creative-target-height', `${majorityHeight}px`);
    return;
  }

  const trackWidth = track.clientWidth;
  const safeWidth = trackWidth * 0.85; // Leave 15% for peek
  const heightLimit = safeWidth / maxAspectRatio;

  const finalHeight = Math.min(majorityHeight, heightLimit);
  track.style.setProperty('--creative-target-height', `${finalHeight}px`);
}

function renderCreativeCarousel(preloadedImages = []) {
  const track = creativeElements.track;
  if (!track) return;

  track.innerHTML = '';

  creativeState.assets.forEach((src, idx) => {
    const slide = document.createElement('figure');
    slide.className = 'creative-slide';
    slide.dataset.index = String(idx);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Project asset ${idx + 1}`;
    img.loading = 'lazy';

    const recordAspect = () => {
      // Dimensions are recorded but we rely on preloaded data now for aspect
      img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    };

    if (img.complete && img.naturalHeight) {
      recordAspect();
    } else {
      img.addEventListener('load', recordAspect, { once: true });
    }



    slide.appendChild(img);
    track.appendChild(slide);
  });

  const dotsContainer = creativeElements.dots;
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    creativeState.assets.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      dot.dataset.index = String(idx);
      dot.addEventListener('click', () => {
        scrollToCreativeSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (!creativeState.assets.length) {
    track.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }

  updateActiveCreativeSlide();
  scrollToCreativeSlide(creativeState.index, { smooth: false });
}

function updateActiveCreativeSlide() {
  const track = creativeElements.track;
  if (!track) return;
  [...track.children].forEach((slide, idx) => {
    slide.classList.toggle('is-active', idx === creativeState.index);
  });

  const dotsContainer = creativeElements.dots;
  if (dotsContainer) {
    [...dotsContainer.children].forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === creativeState.index);
    });
  }
}

function scrollToCreativeSlide(targetIndex, { smooth = true } = {}) {
  const track = creativeElements.track;
  if (!track) return;
  const slide = track.children[targetIndex];
  if (!slide) return;

  creativeState.index = targetIndex;
  updateActiveCreativeSlide();

  const vertical = isTrackVertical();
  const behavior = smooth ? 'smooth' : 'auto';
  const offset = getRelativeOffset(slide, vertical);

  if (vertical) {
    track.scrollTo({ top: offset, behavior });
  } else {
    track.scrollTo({ left: offset, behavior });
  }
}

function handleCreativeClick(event) {
  if (!creativeState.assets.length) return;
  const slide = event.target.closest('.creative-slide');
  if (!slide || !creativeElements.track) return;

  const clickedIndex = Number(slide.dataset.index);
  if (Number.isNaN(clickedIndex)) return;

  const vertical = isTrackVertical();

  let targetIndex = clickedIndex;
  if (vertical) {
    if (clickedIndex === creativeState.index && clickedIndex < creativeState.assets.length - 1) {
      targetIndex = clickedIndex + 1;
    }
  } else {
    targetIndex = clickedIndex === creativeState.index
      ? (creativeState.index + 1) % creativeState.assets.length
      : clickedIndex;
  }

  scrollToCreativeSlide(targetIndex);
}

function syncCreativeIndexWithScroll() {
  creativeScrollTicking = false;
  const track = creativeElements.track;
  if (!track || !track.children.length) return;

  const vertical = isTrackVertical();
  const current = vertical ? track.scrollTop : track.scrollLeft;
  let closestIndex = 0;
  let smallestDelta = Infinity;

  [...track.children].forEach((slide, idx) => {
    const delta = Math.abs(getRelativeOffset(slide, vertical) - current);
    if (delta < smallestDelta) {
      smallestDelta = delta;
      closestIndex = idx;
    }
  });

  if (creativeState.index !== closestIndex) {
    creativeState.index = closestIndex;
    updateActiveCreativeSlide();
  }
}

function handleCreativeScroll() {
  if (creativeScrollTicking) return;
  creativeScrollTicking = true;
  requestAnimationFrame(syncCreativeIndexWithScroll);
}

export function openModal(index) {
  currentIndex = index;
  const proyecto = proyectos[index];
  const prevIndex = (index - 1 + proyectos.length) % proyectos.length;
  const nextIndex = (index + 1) % proyectos.length;
  const modal = document.getElementById("project-modal");
  const wrapper = document.getElementById("modal-video-wrapper");
  const infoDefault = document.getElementById('modal-info-default');
  const creativeInfo = document.getElementById('modal-info-creative');

  // Reset states
  modal.classList.remove("video-only", "creative-mode");
  infoDefault?.classList.remove('active');
  creativeInfo?.classList.remove('active');

  const modalTitleEl = document.getElementById("modal-title");
  const modalDescriptionEl = document.getElementById("modal-description");
  const creativeTitleEl = creativeElements.title;
  const creativeMetaEl = creativeElements.meta;

  if (modalTitleEl) {
    modalTitleEl.textContent = [proyecto.titulo, proyecto.cliente].filter(Boolean).join('\n');
  }
  if (modalDescriptionEl) {
    modalDescriptionEl.textContent = proyecto.descripcion || '';
  }
  if (creativeTitleEl) {
    creativeTitleEl.textContent = '';
  }
  if (creativeMetaEl) {
    creativeMetaEl.innerHTML = '';
  }

  const isVideoType = proyecto.tipo === "VIDEO" || proyecto.tipo === "COMMERCIAL";
  const isCreativeType = proyecto.tipo === "CREATIVE";

  if (isCreativeType) {
    destroyPlayerIfExists();
    modal.classList.add('creative-mode');

    const creativeData = proyecto.etg || {};
    if (creativeTitleEl) {
      const heading = ["CREATIVE", creativeData.title]
        .filter(Boolean)
        .join(' + ');
      creativeTitleEl.textContent = heading.toUpperCase();
    }

    if (creativeMetaEl) {
      const metaEntries = [
        { label: 'ARTIST', value: creativeData.artist || proyecto.cliente },
        { label: 'PROJECT', value: creativeData.project || proyecto.titulo },
        { label: 'DATE', value: creativeData.year },
        { label: 'LABEL', value: creativeData.label }
      ].filter(item => Boolean(item.value));

      creativeMetaEl.innerHTML = metaEntries.map(({ label, value }) => `
        <li><span>${label}:</span> ${value}</li>
      `).join('');
    }

    creativeState.assets = Array.isArray(proyecto.carouselAssets) ? proyecto.carouselAssets : [];
    creativeState.index = 0;
    applyTrackOrientation();
    creativeScrollTicking = false;

    // Show loader
    const track = creativeElements.track;
    if (track) {
      track.innerHTML = '<div class="loader-text">LOADING...</div>';
      track.style.justifyContent = 'center'; // Center loader
    }

    preloadImages(creativeState.assets).then((images) => {
      if (!track) return;
      track.style.justifyContent = ''; // Reset

      creativeState.lastLoadedImages = images;
      updateCarouselHeight();

      renderCreativeCarousel(images);
    });

  } else if (isVideoType && proyecto.video) {
    const vimeoId = proyecto.video.split('/').pop();
    wrapper.innerHTML = `
      <div class="plyr__video-embed"
           data-plyr-provider="vimeo"
           data-plyr-embed-id="${vimeoId}">
      </div>
    `;

    setTimeout(() => {
      destroyPlayerIfExists();
      const embedElement = wrapper.querySelector('.plyr__video-embed');
      if (!embedElement) return;
      window.player = new Plyr(embedElement, {
        controls: ['play', 'progress', 'mute', 'fullscreen'],
        hideControls: true,
        fullscreen: { enabled: true, fallback: true },
        autoplay: true,
        muted: false,
        vimeo: {
          controls: false,
          byline: false,
          portrait: false,
          title: false,
          playsinline: true
        }
      });
      player = window.player;
    }, 50);
  }

  const prevProyecto = proyectos[prevIndex];
  const nextProyecto = proyectos[nextIndex];

  const titleLines = [proyecto.titulo, proyecto.cliente].filter(Boolean).join('\n');
  document.getElementById("modal-title").innerText = titleLines;
  document.getElementById("modal-description").innerText = proyecto.descripcion || '';

  if (isCreativeType) {
    updateCreativeNav(index);
  } else {
    clearCreativeNav();
    if (prevLabel) prevLabel.textContent = `${prevProyecto.titulo}${prevProyecto.cliente ? ' · ' + prevProyecto.cliente : ''}`;
    if (nextLabel) nextLabel.textContent = `${nextProyecto.titulo}${nextProyecto.cliente ? ' · ' + nextProyecto.cliente : ''}`;
  }

  if (isVideoType) {
    modal.classList.add("video-only");
  } else {
    modal.classList.remove("video-only");
  }
  // Special handling for portrait-shot asset (jala-jala)
  if (proyecto.id === "jala-jala") {
    modal.classList.add("portrait-asset");
  } else {
    modal.classList.remove("portrait-asset");
  }
  lockBodyScroll();
  modal.style.display = "flex";
}

export function closeModal() {
  destroyPlayerIfExists();
  const modal = document.getElementById("project-modal");
  modal.classList.remove('video-only', 'creative-mode', 'portrait-asset');
  modal.style.display = "none";
  creativeState.assets = [];
  creativeScrollTicking = false;
  if (creativeElements.track) {
    creativeElements.track.innerHTML = '';
    creativeElements.track.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    creativeElements.track.classList.remove('vertical');
  }
  clearCreativeNav();
  unlockBodyScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  creativeElements.wrapper = document.getElementById('modal-creative-wrapper');
  creativeElements.title = document.getElementById('creative-title');
  creativeElements.meta = document.getElementById('creative-meta');
  creativeElements.track = document.getElementById('creative-track');
  creativeElements.dots = document.getElementById('carousel-dots');

  prevButton = document.getElementById("prev-project");
  nextButton = document.getElementById("next-project");
  prevLabel = document.getElementById("prev-label");
  nextLabel = document.getElementById("next-label");

  if (creativeElements.track) {
    creativeElements.track.addEventListener('click', handleCreativeClick);
    creativeElements.track.addEventListener('scroll', handleCreativeScroll, { passive: true });
  }

  const handleResize = () => {
    const changed = applyTrackOrientation();
    updateCarouselHeight();
    creativeScrollTicking = false;
    if (creativeState.assets.length) {
      scrollToCreativeSlide(creativeState.index, { smooth: !changed });
    }
  };

  window.addEventListener('resize', handleResize);
  applyTrackOrientation();

  prevButton.addEventListener("click", () => {
    const target = Number(prevButton.dataset.targetIndex);
    if (Number.isNaN(target)) return;
    currentIndex = target;
    openModal(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    const target = Number(nextButton.dataset.targetIndex);
    if (Number.isNaN(target)) return;
    currentIndex = target;
    openModal(currentIndex);
  });

  // Inicializa un player vacío por defecto para evitar errores al cerrar el modal sin video
  player = new Plyr('#modal-video', {
    controls: ['play', 'progress', 'mute', 'fullscreen'],
    hideControls: true,
    fullscreen: { enabled: true, fallback: true },
    vimeo: {
      controls: false,
      byline: false,
      portrait: false,
      title: false,
      playsinline: true
    }
  });

  // Keyboard support: Esc to close, arrows to navigate when nav is visible
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('project-modal');
    const isOpen = modal && modal.style.display === 'flex';
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    // Only allow arrow navigation within creative projects when nav is visible
    if (modal.classList.contains('creative-mode')) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = Number(nextButton.dataset.targetIndex);
        if (!Number.isNaN(nextIndex)) {
          currentIndex = nextIndex;
          openModal(currentIndex);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = Number(prevButton.dataset.targetIndex);
        if (!Number.isNaN(prevIndex)) {
          currentIndex = prevIndex;
          openModal(currentIndex);
        }
      }
    }
  });
});
