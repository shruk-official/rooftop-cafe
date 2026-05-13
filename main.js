// ============================================================
// SkyBrown Rooftop Café — Main Script
// Resilient, crash-proof, works on slow/bad internet
// ============================================================

// Safe DOM queries — never crash if elements are missing
const navToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('desktopNav');
const navbar = document.querySelector('.navbar');
const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right], [data-reveal-up]');
const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
const hero = document.querySelector('.hero');
const heroPanel = document.querySelector('.hero__panel');
const heroCanvas = document.querySelector('.hero__canvas');
const video = document.querySelector('.hero__video');
const preloader = document.querySelector('.preloader');
const testimonialSlider = document.querySelector('.testimonial-slider');
const scrollProgress = document.querySelector('.scroll-progress');

// ============================================================
// A: Intersection Observer Reveals
// ============================================================
function handleReveal(entries) {
  // Only start revealing after the preloader is hidden
  if (document.body.style.overflow === 'hidden') return;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}

let revealObserver = null;
try {
  revealObserver = new IntersectionObserver(handleReveal, {
    threshold: 0.18,
  });
  revealElements.forEach((element) => revealObserver.observe(element));
} catch (e) {
  // Fallback: just show everything immediately if IntersectionObserver isn't available
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

// ============================================================
// B: Navbar scroll handling + scroll progress
// ============================================================
function updateNavbar() {
  try {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 30;
    navbar?.classList.toggle('navbar--scrolled', isScrolled);

    // Scroll Progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0 && scrollProgress) {
      const scrolled = (scrollY / scrollHeight) * 100;
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Global parallax variable
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
  } catch (e) {
    // Silently fail — navbar is non-critical
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ============================================================
// C: Mobile menu toggle
// ============================================================
navToggle?.addEventListener('click', () => {
  try {
    const opened = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('active', opened);
    if (opened) {
      navbar?.classList.add('navbar--scrolled');
    }
  } catch (e) { /* non-critical */ }
});

window.addEventListener('click', (event) => {
  try {
    if (navMenu && navToggle && !navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('active');
    }
  } catch (e) { /* non-critical */ }
});

// ============================================================
// D: Testimonial scroll-linked scale effect
// ============================================================
function updateTestimonialsScale() {
  try {
    if (!testimonialSlider) return;
    const sliderRect = testimonialSlider.getBoundingClientRect();
    const sliderCenter = sliderRect.left + sliderRect.width / 2;

    testimonialCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distanceFromCenter = Math.abs(sliderCenter - cardCenter);

      const maxDistance = sliderRect.width / 1.5;
      const scale = Math.max(0.85, 1 - (distanceFromCenter / maxDistance) * 0.15);
      const opacity = Math.max(0.4, 1 - (distanceFromCenter / maxDistance) * 0.6);

      card.style.transform = `scale(${scale})`;
      card.style.opacity = opacity;
    });
  } catch (e) { /* non-critical */ }
}

if (testimonialSlider) {
  testimonialSlider.addEventListener('scroll', updateTestimonialsScale, { passive: true });
  updateTestimonialsScale();
}

// ============================================================
// E: 3D Tilt + Glass Shimmer on cards
// ============================================================
try {
  const tiltCards = document.querySelectorAll('.drink-card, .gallery-card, .event-list article, .testimonial-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      try {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        card.style.setProperty('--shimmer-x', `${(x / width) * 100}%`);
        card.style.setProperty('--shimmer-y', `${(y / height) * 100}%`);

        const rotateX = ((y / height) - 0.5) * 12;
        const rotateY = ((x / width) - 0.5) * 12;
        card.style.transform = `perspective(900px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      } catch (e) { /* non-critical */ }
    });

    card.addEventListener('mouseleave', () => {
      try {
        card.style.transform = '';
        card.style.setProperty('--shimmer-x', '50%');
        card.style.setProperty('--shimmer-y', '50%');
      } catch (e) { /* non-critical */ }
    });
  });
} catch (e) { /* non-critical */ }

// ============================================================
// F: Hero mouse parallax
// ============================================================
hero?.addEventListener('mousemove', (event) => {
  try {
    const x = (event.clientX / window.innerWidth - 0.5) * 40;
    const y = (event.clientY / window.innerHeight - 0.5) * 30;

    hero.style.setProperty('--mouse-x', `${x}px`);
    hero.style.setProperty('--mouse-y', `${y}px`);

    heroPanel?.style.setProperty('--panel-x', `${x * 0.2}px`);
    heroPanel?.style.setProperty('--panel-y', `${y * 0.2}px`);
  } catch (e) { /* non-critical */ }
});

hero?.addEventListener('mouseleave', () => {
  try {
    [hero, heroPanel].forEach(el => {
      el?.style.setProperty('--mouse-x', '0px');
      el?.style.setProperty('--mouse-y', '0px');
      el?.style.setProperty('--panel-x', '0px');
      el?.style.setProperty('--panel-y', '0px');
    });
  } catch (e) { /* non-critical */ }
});

// ============================================================
// G: Hero canvas ambient animation
// ============================================================
function animateHeroBackground() {
  try {
    if (!heroCanvas) return;
    const time = Date.now() * 0.00012;
    heroCanvas.style.transform = `scale(1.08) translate3d(${Math.sin(time) * 18}px, ${Math.cos(time) * 10}px, 0)`;
    requestAnimationFrame(animateHeroBackground);
  } catch (e) { /* non-critical — animation stops gracefully */ }
}

animateHeroBackground();

// ============================================================
// H: Video playback — resilient, no dark flash
// ============================================================
function ensureVideoPlays() {
  if (!video) return;

  // The video is visible by default (CSS opacity: 1) so there's no dark flash.
  // We just need to ensure it actually plays.

  let retryCount = 0;
  const maxRetries = 15;

  function tryPlay() {
    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.classList.add('is-playing');
        }).catch((err) => {
          if (retryCount < maxRetries) {
            retryCount++;
            // Exponential backoff for slow connections
            setTimeout(tryPlay, Math.min(300 * retryCount, 3000));
          } else {
            // After max retries, video stays visible (warm gradient behind)
            // No crash, no dark screen — the user sees the site content regardless
            video.classList.add('is-playing');
          }
        });
      }
    } catch (e) {
      // Even if video.play() itself throws, the site stays functional
      video.classList.add('is-playing');
    }
  }

  tryPlay();

  // Re-trigger play when tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    try {
      if (!document.hidden && video.paused) {
        retryCount = 0;
        tryPlay();
      }
    } catch (e) { /* non-critical */ }
  });

  // Handle video errors (e.g. 404, network failure) gracefully
  video.addEventListener('error', () => {
    // Video failed to load — just hide it so the warm gradient background shows
    video.style.display = 'none';
  });

  // Handle stalling on slow connections
  video.addEventListener('stalled', () => {
    // Don't crash — the video element stays visible, it will resume when data arrives
  });

  video.addEventListener('waiting', () => {
    // Video is buffering — no action needed, it auto-resumes
  });
}

ensureVideoPlays();

// ============================================================
// I: Preloader logic — with safety timeout
// ============================================================
function hidePreloader() {
  try {
    if (!preloader || preloader.classList.contains('preloader--hidden')) return;

    preloader.classList.add('preloader--hidden');
    document.body.style.overflow = '';
    sessionStorage.setItem('visited', 'true');

    // Trigger reveals for elements currently in view
    revealElements.forEach(el => {
      try {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        }
      } catch (e) {
        el.classList.add('is-visible');
      }
    });
  } catch (e) {
    // If anything fails, make sure content is visible
    if (preloader) {
      preloader.style.display = 'none';
    }
    document.body.style.overflow = '';
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}

if (preloader) {
  let hasVisited = false;
  try {
    hasVisited = sessionStorage.getItem('visited') === 'true';
  } catch (e) {
    // sessionStorage might be blocked (incognito, etc.)
    hasVisited = false;
  }

  if (hasVisited) {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    setTimeout(() => {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }, 100);
  } else {
    document.body.style.overflow = 'hidden';

    if (video) {
      // Hide preloader once video has enough data to play
      video.addEventListener('canplaythrough', () => {
        setTimeout(hidePreloader, 1500);
      }, { once: true });

      // Also listen for 'canplay' as a fallback for slow connections
      // (canplaythrough may never fire on slow networks)
      video.addEventListener('canplay', () => {
        setTimeout(hidePreloader, 2000);
      }, { once: true });
    }

    // Safety net: always hide preloader after max 4 seconds
    // Even if video hasn't loaded, the user should see content
    setTimeout(hidePreloader, 4000);
  }
}

// ============================================================
// J: Testimonial dots (scroll-synced)
// ============================================================
if (testimonialSlider) {
  const dots = document.querySelectorAll('.testimonial-dots span');
  let isTicking = false;

  testimonialSlider.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(() => {
        try {
          updateTestimonialsScale();

          const scrollLeft = testimonialSlider.scrollLeft;
          const width = testimonialSlider.offsetWidth;
          const index = Math.round(scrollLeft / width);

          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        } catch (e) { /* non-critical */ }
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}

// ============================================================
// K: Close mobile nav when clicking anchor links
// ============================================================
try {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('is-open');
      navToggle?.classList.remove('active');
    });
  });
} catch (e) { /* non-critical */ }

// ============================================================
// L: Connection-aware optimizations
// ============================================================
try {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    // On slow connections, disable non-essential animations to improve performance
    const isSlowConnection = connection.effectiveType === 'slow-2g' ||
                             connection.effectiveType === '2g' ||
                             connection.saveData === true;

    if (isSlowConnection) {
      // Disable parallax and tilt effects on slow connections
      document.documentElement.style.setProperty('--scroll-y', '0px');

      // Reduce animation complexity
      document.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right], [data-reveal-up]').forEach(el => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.transform = 'none';
      });

      // Stop hero canvas animation
      if (heroCanvas) {
        heroCanvas.style.animation = 'none';
        heroCanvas.style.transform = 'none';
      }

      // Hide video on very slow connections to save bandwidth
      if (video && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        video.style.display = 'none';
      }
    }
  }
} catch (e) {
  // Network Information API not supported — site works fine without it
}

// ============================================================
// M: Global error handler — prevent crashes from breaking the site
// ============================================================
window.addEventListener('error', (event) => {
  // Log but don't crash
  console.warn('SkyBrown: Non-critical error caught:', event.message);
  // Prevent the error from crashing the page
  return true;
});

window.addEventListener('unhandledrejection', (event) => {
  // Prevent unhandled promise rejections from crashing the page
  console.warn('SkyBrown: Promise rejection handled:', event.reason);
  event.preventDefault();
});
