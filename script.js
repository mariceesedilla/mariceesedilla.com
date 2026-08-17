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

const revealTargets = Array.from(document.querySelectorAll([
  '.skills-heading',
  '.primary-automation-stack',
  '.other-tools-heading',
  '.tools-marquee',
  '.projects .section-heading-row',
  '.project-node',
  '.services .section-heading-row',
  '.service-item',
  '.contact-inner > .eyebrow',
  '.contact h2',
  '.contact-inner > p:not(.eyebrow)',
  '.contact-links a'
].join(',')));

let revealObserver = null;

function showAllRevealTargets() {
  revealObserver?.disconnect();
  revealTargets.forEach((target) => {
    target.classList.remove('reveal-item', 'is-visible');
    target.style.removeProperty('--reveal-delay');
  });
  document.documentElement.classList.remove('reveal-enabled');
}

function initializeScrollReveals() {
  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
    showAllRevealTargets();
    return;
  }

  document.documentElement.classList.add('reveal-enabled');
  revealTargets.forEach((target) => {
    const isStaggeredCard = target.matches('.project-node, .service-item, .contact-links a');
    const siblingIndex = isStaggeredCard ? Array.from(target.parentElement.children).indexOf(target) : 0;
    target.style.setProperty('--reveal-delay', `${Math.max(0, siblingIndex) * 90}ms`);
    target.classList.add('reveal-item');
  });

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const delay = Number.parseInt(target.style.getPropertyValue('--reveal-delay'), 10) || 0;
      target.classList.add('is-visible');
      revealObserver.unobserve(target);
      window.setTimeout(() => {
        target.classList.remove('reveal-item', 'is-visible');
        target.style.removeProperty('--reveal-delay');
      }, 820 + delay);
    });
  }, { rootMargin: '0px 0px -10%', threshold: .12 });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

initializeScrollReveals();
reducedMotionQuery.addEventListener('change', () => {
  if (reducedMotionQuery.matches) showAllRevealTargets();
  else initializeScrollReveals();
});

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
  const heroSection = document.querySelector('.hero');
  let pointerFrame = 0;

  const hidePointerGlow = () => {
    ambientBackground.classList.remove('has-pointer');
    heroSection?.style.setProperty('--hero-wave-x', '0px');
    heroSection?.style.setProperty('--hero-wave-y', '0px');
    heroSection?.style.setProperty('--portrait-shift-x', '0px');
    heroSection?.style.setProperty('--portrait-shift-y', '0px');
  };

  window.addEventListener('pointermove', (event) => {
    if (!finePointerQuery.matches || reducedMotionQuery.matches) {
      hidePointerGlow();
      return;
    }

    window.cancelAnimationFrame(pointerFrame);
    pointerFrame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      if (heroSection) {
        const horizontalPosition = (event.clientX / window.innerWidth) - .5;
        const verticalPosition = (event.clientY / window.innerHeight) - .5;
        heroSection.style.setProperty('--hero-wave-x', `${horizontalPosition * 18}px`);
        heroSection.style.setProperty('--hero-wave-y', `${verticalPosition * 12}px`);
        heroSection.style.setProperty('--portrait-shift-x', `${horizontalPosition * -7}px`);
        heroSection.style.setProperty('--portrait-shift-y', `${verticalPosition * -5}px`);
      }
      ambientBackground.classList.add('has-pointer');
    });
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', hidePointerGlow);
  window.addEventListener('blur', hidePointerGlow);
  finePointerQuery.addEventListener('change', hidePointerGlow);
  reducedMotionQuery.addEventListener('change', hidePointerGlow);
}

document.getElementById('current-year').textContent = new Date().getFullYear();
