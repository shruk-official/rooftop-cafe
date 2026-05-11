const navToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('desktopNav');
const navbar = document.querySelector('.navbar');
const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right], [data-reveal-up]');
const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
const hero = document.querySelector('.hero');

function handleReveal(entries) {
  // Only start revealing after the preloader is hidden (6s)
  if (document.body.style.overflow === 'hidden') return;
  
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}

const revealObserver = new IntersectionObserver(handleReveal, {
  threshold: 0.18,
});

revealElements.forEach((element) => revealObserver.observe(element));

function updateNavbar() {
  const scrollY = window.scrollY;
  const isScrolled = scrollY > 30;
  navbar?.classList.toggle('navbar--scrolled', isScrolled);
  
  // Scroll Progress logic
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollY / scrollHeight) * 100;
  document.querySelector('.scroll-progress').style.width = `${scrolled}%`;
  
  // Global parallax variable
  document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

navToggle?.addEventListener('click', () => {
  const opened = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('active', opened);
  if (opened) {
    navbar?.classList.add('navbar--scrolled');
  }
});

window.addEventListener('click', (event) => {
  if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('active');
  }
});
const heroPanel = document.querySelector('.hero__panel');

// C: Scroll-Linked "Shrink" for Testimonials
const testimonialSlider = document.querySelector('.testimonial-slider');

function updateTestimonialsScale() {
  if (!testimonialSlider) return;
  const sliderRect = testimonialSlider.getBoundingClientRect();
  const sliderCenter = sliderRect.left + sliderRect.width / 2;

  testimonialCards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distanceFromCenter = Math.abs(sliderCenter - cardCenter);
    
    // Scale down cards as they move away from the center
    const maxDistance = sliderRect.width / 1.5;
    const scale = Math.max(0.85, 1 - (distanceFromCenter / maxDistance) * 0.15);
    const opacity = Math.max(0.4, 1 - (distanceFromCenter / maxDistance) * 0.6);
    
    card.style.transform = `scale(${scale})`;
    card.style.opacity = opacity;
  });
}

if (testimonialSlider) {
  testimonialSlider.addEventListener('scroll', updateTestimonialsScale);
  // Initial call
  updateTestimonialsScale();
}

const tiltCards = document.querySelectorAll('.drink-card, .gallery-card, .event-list article, .testimonial-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    
    // D: Glass Shimmer tracking
    card.style.setProperty('--shimmer-x', `${(x / width) * 100}%`);
    card.style.setProperty('--shimmer-y', `${(y / height) * 100}%`);

    const rotateX = ((y / height) - 0.5) * 12;
    const rotateY = ((x / width) - 0.5) * 12;
    card.style.transform = `perspective(900px) rotateX(${ -rotateX }deg) rotateY(${ rotateY }deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    // Reset shimmer
    card.style.setProperty('--shimmer-x', '50%');
    card.style.setProperty('--shimmer-y', '50%');
  });
});

hero?.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 40;
  const y = (event.clientY / window.innerHeight - 0.5) * 30;
  
  // B: 3D Floating Parallax (Different speeds for depth)
  hero.style.setProperty('--mouse-x', `${x}px`);
  hero.style.setProperty('--mouse-y', `${y}px`);
  
  // Panel moves slightly slower for depth
  heroPanel?.style.setProperty('--panel-x', `${x * 0.2}px`);
  heroPanel?.style.setProperty('--panel-y', `${y * 0.2}px`);
});

hero?.addEventListener('mouseleave', () => {
  [hero, heroPanel].forEach(el => {
    el?.style.setProperty('--mouse-x', '0px');
    el?.style.setProperty('--mouse-y', '0px');
    el?.style.setProperty('--panel-x', '0px');
    el?.style.setProperty('--panel-y', '0px');
  });
});


const heroCanvas = document.querySelector('.hero__canvas');

function animateHeroBackground() {
  if (!heroCanvas) return;
  const time = Date.now() * 0.00012;
  heroCanvas.style.transform = `scale(1.08) translate3d(${Math.sin(time) * 18}px, ${Math.cos(time) * 10}px, 0)`;
  requestAnimationFrame(animateHeroBackground);
}

animateHeroBackground();

// Optimized Video and Preloader logic
const video = document.querySelector('.hero__video');
const preloader = document.querySelector('.preloader');

function hidePreloader() {
  if (!preloader || preloader.classList.contains('preloader--hidden')) return;
  
  preloader.classList.add('preloader--hidden');
  document.body.style.overflow = '';
  sessionStorage.setItem('visited', 'true');
  
  // Trigger reveals for elements in view
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });
}

if (preloader) {
  const hasVisited = sessionStorage.getItem('visited');

  if (hasVisited) {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    setTimeout(() => {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }, 100);
  } else {
    document.body.style.overflow = 'hidden';

    // 1. Ensure video plays immediately
    if (video) {
      video.play().catch(() => {
        // Fallback if autoplay is blocked
        console.log('Autoplay blocked, waiting for interaction');
      });

      // 2. Hide preloader as soon as video can play
      video.addEventListener('canplaythrough', () => {
        // Add a small delay for the animation to feel smooth
        setTimeout(hidePreloader, 1500); 
      }, { once: true });
    }

    // 3. Absolute maximum wait time (safety net)
    // Reduced from 6s to 3.5s for a snappier feel
    setTimeout(hidePreloader, 3500);
  }
}


// Update active testimonial dot on scroll
if (testimonialSlider) {
  const dots = document.querySelectorAll('.testimonial-dots span');
  let isTicking = false;
  
  testimonialSlider.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateTestimonialsScale();
        
        // Update dots
        const scrollLeft = testimonialSlider.scrollLeft;
        const width = testimonialSlider.offsetWidth;
        const index = Math.round(scrollLeft / width);
        
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
        
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}


const links = document.querySelectorAll('a[href^="#"]');
links.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
  });
});
