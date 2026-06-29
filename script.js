// ============================================
// Kanha Women Hospital - Main JavaScript
// ============================================
'use strict';

// ============================
// LOADING SCREEN
// ============================
window.addEventListener('load', () => {
  setTimeout(() => {
    const screen = document.getElementById('loading-screen');
    if (screen) screen.classList.add('hidden');
  }, 1800);
});

// ============================
// STICKY HEADER
// ============================
const header = document.getElementById('main-header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header?.classList.add('scrolled');
  else header?.classList.remove('scrolled');

  // Back to top
  const backTop = document.querySelector('.float-btn-top');
  if (backTop) {
    if (window.scrollY > 400) backTop.classList.add('visible');
    else backTop.classList.remove('visible');
  }
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu?.classList.toggle('open');
});

// Close nav on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navMenu?.classList.remove('open');
  });
});

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

// ============================
// SMOOTH SCROLL
// ============================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ============================
// SCROLL REVEAL
// ============================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => revealObserver.observe(el));

// ============================
// COUNTER ANIMATION
// ============================
function animateCounter(el, target, duration = 1800) {
  const isFloat = String(target).includes('.');
  let start = 0; const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = progress * target;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString() + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ============================
// TESTIMONIALS CAROUSEL
// ============================
(function initCarousel() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let current = 0;
  let autoTimer;

  function getVisible() {
    if (window.innerWidth < 700) return 1;
    if (window.innerWidth < 1000) return 2;
    return 3;
  }

  function goTo(idx) {
    const visible = getVisible();
    const max = Math.max(0, cards.length - visible);
    current = Math.max(0, Math.min(idx, max));
    const cardWidth = cards[0]?.offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.querySelector('.carousel-prev')?.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); startAuto(); });
  document.querySelector('.carousel-next')?.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(autoTimer); goTo(i); startAuto(); }));

  function startAuto() { autoTimer = setInterval(() => { const visible = getVisible(); goTo((current + 1) % Math.max(1, cards.length - visible + 1)); }, 4500); }
  startAuto();
  window.addEventListener('resize', () => goTo(0));
})();

// ============================
// GALLERY FILTER + LIGHTBOX
// ============================
(function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || '';
      if (lightboxImg) lightboxImg.src = src;
      lightbox?.classList.add('open');
    });
  });

  document.getElementById('lightbox-close')?.addEventListener('click', () => lightbox?.classList.remove('open'));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
})();

// ============================
// VIDEO CONTROL
// ============================
const videos = document.querySelectorAll('video');

videos.forEach(video => {
  video.addEventListener('play', () => {
    videos.forEach(otherVideo => {
      if (otherVideo !== video) {
        otherVideo.pause();
      }
    });
  });
});

// ============================
// FAQ ACCORDION
// ============================
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});


// ============================
// BACK TO TOP
// ============================
document.querySelector('.float-btn-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================
// PARALLAX (subtle)
// ============================
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 900) {
    hero.style.backgroundPositionY = window.scrollY * 0.35 + 'px';
  }
}, { passive: true });

// ============================
// WHATSAPP APPOINTMENT FORM
// ============================
const appointmentForm = document.getElementById("appointment-form");

if (appointmentForm) {
  appointmentForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.querySelector('[name="full_name"]').value;
    const mobile = document.querySelector('[name="mobile"]').value;
    const service = document.querySelector('[name="service"]').value;
    const date = document.querySelector('[name="appointment_date"]').value;
    const time = document.querySelector('[name="appointment_time"]').value;
    const message = document.querySelector('[name="message"]').value;

    const whatsappMessage =
`🌸 New Appointment Request

👤 Name: ${name}
📱 Mobile: ${mobile}
🏥 Service: ${service}
📅 Date: ${date}
⏰ Time: ${time}

📝 Message:
${message}`;

    const whatsappNumber = "919875038948";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  });
}