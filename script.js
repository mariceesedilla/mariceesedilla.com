const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navigationLinks = document.querySelectorAll('.primary-nav a');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Open navigation menu';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open navigation menu' : 'Close navigation menu';
  navigation.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

// Show an intentional placeholder if a portfolio image has not been added yet.
document.querySelectorAll('img[data-fallback-target]').forEach((image) => {
  const showFallback = () => {
    image.classList.add('is-missing');
    const fallback = document.getElementById(image.dataset.fallbackTarget);
    if (fallback) fallback.removeAttribute('aria-hidden');
  };

  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});

const observedSections = document.querySelectorAll('header[id], main section[id]');
const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-30% 0px -60%', threshold: 0 });

observedSections.forEach((section) => activeLinkObserver.observe(section));

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const projectHub = document.querySelector('[data-project-hub]');

if (projectHub) {
  const projectNodes = Array.from(projectHub.querySelectorAll('[data-project-node]'));

  projectNodes.forEach((node, nodeIndex) => {
    const slider = node.querySelector('[data-node-slider]');
    const slides = Array.from(slider.querySelectorAll('.project-node-slide'));
    const dots = Array.from(slider.querySelectorAll('.project-node-dots i'));
    let activeSlideIndex = 0;
    let slideTimer = null;
    let sliderPaused = false;

    function showSlide(index) {
      activeSlideIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlideIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        dots[slideIndex]?.classList.toggle('is-active', isActive);
      });
    }

    function stopSlideshow() {
      window.clearInterval(slideTimer);
      slideTimer = null;
    }

    function startSlideshow() {
      stopSlideshow();
      if (reducedMotionQuery.matches || sliderPaused || document.hidden || slides.length < 2) return;
      slideTimer = window.setInterval(() => showSlide(activeSlideIndex + 1), 3400 + (nodeIndex * 250));
    }

    function pauseNode() {
      sliderPaused = true;
      stopSlideshow();
    }

    function resumeNode(event) {
      if (event.type === 'focusout' && node.contains(event.relatedTarget)) return;
      sliderPaused = false;
      startSlideshow();
    }

    node.addEventListener('mouseenter', pauseNode);
    node.addEventListener('mouseleave', resumeNode);
    node.addEventListener('focusin', pauseNode);
    node.addEventListener('focusout', resumeNode);

    reducedMotionQuery.addEventListener('change', () => {
      if (reducedMotionQuery.matches) {
        showSlide(0);
        stopSlideshow();
      } else {
        startSlideshow();
      }
    });

    document.addEventListener('visibilitychange', startSlideshow);
    showSlide(0);
    startSlideshow();
  });
}

document.querySelectorAll('[data-tool-marquee]').forEach((marquee) => {
  marquee.querySelectorAll('[data-marquee-row]').forEach((row) => {
    const track = row.querySelector('.tool-marquee-track');
    const group = track?.querySelector('.tool-marquee-group');
    if (!track || !group) return;

    const repeatedGroup = group.cloneNode(true);
    repeatedGroup.setAttribute('aria-hidden', 'true');
    track.append(repeatedGroup);
  });

  marquee.classList.add('is-ready');
});

const ambientBackground = document.querySelector('[data-ambient-background]');

if (ambientBackground) {
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  let pointerFrame = 0;

  const hidePointerGlow = () => ambientBackground.classList.remove('has-pointer');

  window.addEventListener('pointermove', (event) => {
    if (!finePointerQuery.matches || reducedMotionQuery.matches) {
      hidePointerGlow();
      return;
    }

    window.cancelAnimationFrame(pointerFrame);
    pointerFrame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      ambientBackground.classList.add('has-pointer');
    });
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', hidePointerGlow);
  window.addEventListener('blur', hidePointerGlow);
  finePointerQuery.addEventListener('change', hidePointerGlow);
  reducedMotionQuery.addEventListener('change', hidePointerGlow);
}

document.getElementById('current-year').textContent = new Date().getFullYear();
