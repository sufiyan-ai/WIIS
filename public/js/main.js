/* ============================================================
   HIS — Hidayah International School
   Global JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── BODY FADE-IN ── */
  document.body.classList.add('loaded');

  /* ── NAVBAR SCROLL ── */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    // Back to top visibility
    const btt = document.querySelector('.back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 300);
    // Update back-to-top progress
    updateBttProgress();
    // Parallax hero
    updateHeroParallax();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      })
    );
  }

  /* ── FLOATING ACTION BUTTON ── */
  const fabMain    = document.querySelector('.fab-main');
  const fabActions = document.querySelector('.fab-actions');
  if (fabMain && fabActions) {
    fabMain.addEventListener('click', (e) => {
      const isOpen = fabActions.classList.toggle('open');
      fabMain.classList.toggle('is-open', isOpen);
      // Ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'fab-ripple';
      const rect = fabMain.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
      fabMain.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.fab-container')) {
        fabActions.classList.remove('open');
        fabMain.classList.remove('is-open');
      }
    });
  }

  /* ── HERO SLIDER ── */
  const slider = document.querySelector('.hero-slider');
  let heroSlides = [];
  if (slider) {
    const slides     = slider.querySelectorAll('.hero-slide');
    const dots       = document.querySelectorAll('.slider-dot');
    const btnPrev    = document.querySelector('.slider-prev');
    const btnNext    = document.querySelector('.slider-next');
    heroSlides = Array.from(slides);
    let   current    = 0;
    let   timer;

    const animateWords = (slide) => {
      const h1 = slide.querySelector('h1');
      if (!h1) return;
      // Store original HTML if not done
      if (!h1.dataset.original) h1.dataset.original = h1.innerHTML;
      // Reset to original
      h1.innerHTML = h1.dataset.original;
      // Wrap words in spans
      h1.innerHTML = h1.innerHTML.replace(/<br\s*\/?>/gi, ' ⏎ ').split(/\s+/).map((word, i) => {
        if (word === '⏎') return '<br>';
        return `<span class="hw" style="animation-delay:${i * 0.1}s">${word}</span>`;
      }).join(' ');
    };

    const goTo = (idx) => {
      // Reset parallax on outgoing slide
      const outBg = slides[current].querySelector('.hero-bg');
      if (outBg) outBg.style.transform = '';
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
      animateWords(slides[current]);
    };

    const auto = () => { timer = setInterval(() => goTo(current + 1), 5000); };
    const stop = () => clearInterval(timer);

    if (slides.length) {
      goTo(0);
      auto();
      btnNext?.addEventListener('click', () => { stop(); goTo(current + 1); auto(); });
      btnPrev?.addEventListener('click', () => { stop(); goTo(current - 1); auto(); });
      dots.forEach((d, i) => d.addEventListener('click', () => { stop(); goTo(i); auto(); }));
    }
  }

  /* ── HERO PARALLAX ── */
  function updateHeroParallax() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;
    const activeSlide = document.querySelector('.hero-slide.active');
    if (!activeSlide) return;
    const bg = activeSlide.querySelector('.hero-bg');
    if (bg) bg.style.transform = `translateY(${scrollY * 0.25}px)`;
  }

  /* ── ISLAMIC VALUES SLIDESHOW ── */
  const valSlider = document.querySelector('.values-slider');
  if (valSlider) {
    const items  = valSlider.querySelectorAll('.values-slide');
    const dots   = document.querySelectorAll('.values-dot');
    let   cur    = 0;
    let   vtimer;

    const vGoTo = (idx) => {
      items[cur].classList.remove('active');
      dots[cur]?.classList.remove('active');
      cur = (idx + items.length) % items.length;
      items[cur].classList.add('active');
      dots[cur]?.classList.add('active');
    };

    if (items.length) {
      vGoTo(0);
      vtimer = setInterval(() => vGoTo(cur + 1), 4000);
      window.addEventListener('pagehide', () => clearInterval(vtimer));
    }
  }

  /* ── ACCORDION ── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── SCROLL REVEAL (with auto-variants) ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    // Auto-assign reveal variant based on context
    if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
      const parent = el.parentElement;
      const isCard = el.closest('.why-grid, .programs-grid, .highlights-row, .life-grid, .grades-grid, .infra-grid, .pillars-grid, .act-cards, .cocurr-grid, .events-gallery');
      const isLeft = el.classList.contains('welcome-image') || el.classList.contains('left-col') || el.classList.contains('adm-overview-img');
      const isRight = el.classList.contains('welcome-text') || el.classList.contains('right-col') || el.classList.contains('adm-overview-text');
      if (isCard) el.classList.add('reveal-scale');
      else if (isLeft) el.classList.add('reveal-left');
      else if (isRight) el.classList.add('reveal-right');
    }
    revealObserver.observe(el);
  });

  /* ── STAGGER CHILDREN ── */
  document.querySelectorAll('.stagger').forEach(parent => {
    parent.querySelectorAll('.reveal').forEach((child, i) => {
      const delay = Math.min(i * 0.1, 0.5);
      child.style.transitionDelay = `${delay}s`;
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu a, .nav-cta').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── BACK TO TOP ── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateBttProgress() {
    const btt = document.querySelector('.back-to-top');
    if (!btt) return;
    const circle = btt.querySelector('.btt-progress');
    if (!circle) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const circumference = 2 * Math.PI * 19; // r=19
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
  }

  /* ── TOAST UTILITY ── */
  function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed',
      'bottom:32px',
      'left:50%',
      'transform:translateX(-50%) translateY(16px)',
      'background:var(--green)',
      'color:#fff',
      'padding:12px 24px',
      'border-radius:50px',
      'font-size:0.88rem',
      'font-weight:600',
      'font-family:var(--font-body)',
      'box-shadow:0 4px 20px rgba(27,67,50,0.35)',
      'z-index:9999',
      'opacity:0',
      'transition:opacity 0.25s ease, transform 0.25s ease',
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';');
    document.body.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ── ADMISSION FORM → WHATSAPP ── */
  const form = document.getElementById('admissionForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const studentName  = document.getElementById('studentName')?.value.trim()  || '—';
      const parentName   = document.getElementById('parentName')?.value.trim()   || '—';
      const phone        = document.getElementById('phone')?.value.trim()        || '—';
      const classApplied = document.getElementById('classApplied')?.value.trim() || '—';
      const address      = document.getElementById('address')?.value.trim()      || '—';
      const message      = document.getElementById('message')?.value.trim()      || '—';

      const waText = [
        '🏫 *New Admission Enquiry — Hidayah International School*',
        '',
        `👦 Student Name: ${studentName}`,
        `👨‍👩‍👧 Parent Name: ${parentName}`,
        `📞 Phone: ${phone}`,
        `📋 Class Applying For: ${classApplied}`,
        `📍 Address: ${address}`,
        `💬 Message: ${message}`,
        '',
        '_Sent via HIS Website_',
      ].join('\n');

      showToast('Redirecting to WhatsApp…', 1500);
      setTimeout(() => {
        window.open('https://wa.me/917667490559?text=' + encodeURIComponent(waText), '_blank');
      }, 400);
    });
  }

  /* ── CONTACT FORM → WHATSAPP ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('name')?.value.trim()     || '—';
      const phone   = document.getElementById('cphone')?.value.trim()   || '—';
      const email   = document.getElementById('cemail')?.value.trim()   || '—';
      const message = document.getElementById('cmessage')?.value.trim() || '—';

      const waText = [
        '📩 *New Message — Hidayah International School Website*',
        '',
        `👤 Name: ${name}`,
        `📞 Phone: ${phone}`,
        `✉️ Email: ${email}`,
        `💬 Message: ${message}`,
        '',
        '_Sent via HIS Website_',
      ].join('\n');

      showToast('Redirecting to WhatsApp…', 1500);
      setTimeout(() => {
        window.open('https://wa.me/917667490559?text=' + encodeURIComponent(waText), '_blank');
      }, 400);
    });
  }

  /* ── CUSTOM CURSOR ── */
  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
    document.body.classList.add('has-custom-cursor');

    // Inject cursor elements
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // Position state
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    const lerp = (a, b, t) => a + (b - a) * t;

    // Hidden until first mousemove
    dot.style.opacity  = '0';
    ring.style.opacity = '0';

    // Cursor state manager — one active class at a time on <body>
    const CURSOR_STATES = ['cursor-hover', 'cursor-heading', 'cursor-card', 'cursor-fab', 'cursor-nav'];
    const setCursorState = (state) => {
      CURSOR_STATES.forEach(s => document.body.classList.remove(s));
      if (state) document.body.classList.add(state);
    };

    // Dot follows mouse instantly
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity  = '';
      ring.style.opacity = '';
      dot.style.translate = `${mouseX - 4}px ${mouseY - 4}px`;
    });

    // Hover state detection via event delegation
    document.addEventListener('mouseover', e => {
      const t = e.target;
      if (t.closest('.fab-main, .fab-btn'))
        setCursorState('cursor-fab');
      else if (t.closest('.nav-link'))
        setCursorState('cursor-nav');
      else if (t.closest('a, button, .btn'))
        setCursorState('cursor-hover');
      else if (t.closest('h1, h2, h3'))
        setCursorState('cursor-heading');
      else if (t.closest('.card, .act-card, .why-card, .life-card, .program-card, .grade-card, .pillar-card, .infra-card, .cocurr-card, .vm-card, .contact-card, .gallery-item, .hl-card, .values-slide'))
        setCursorState('cursor-card');
      else
        setCursorState(null);
    });

    // Click: shrink on mousedown, restore on mouseup
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // Click ripple at cursor position
    document.addEventListener('click', e => {
      const r = document.createElement('div');
      r.className = 'cursor-ripple';
      r.style.cssText = `left:${e.clientX - 30}px;top:${e.clientY - 30}px`;
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 550);
    });

    // Hide/show when cursor leaves/enters browser window
    document.documentElement.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.documentElement.addEventListener('mouseenter', () => {
      dot.style.opacity  = '';
      ring.style.opacity = '';
    });

    // RAF loop — ring lerps with 0.12 factor for trailing effect
    (function animateCursor() {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.translate = `${ringX - 14}px ${ringY - 14}px`;
      requestAnimationFrame(animateCursor);
    })();

    /* ── CARD SPOTLIGHT ──
       Radial gold glow that follows the cursor within cards,
       creating a smooth light transition between components  */
    const SPOTLIGHT_SEL = [
      '.why-card', '.vm-card', '.act-card', '.program-card',
      '.grade-card', '.pillar-card', '.infra-card', '.cocurr-card',
      '.contact-card', '.hl-card', '.social-btn', '.social-connect-btn',
      '.gallery-item',
    ].join(', ');

    document.querySelectorAll(SPOTLIGHT_SEL).forEach(el => {
      el.classList.add('has-spotlight');
      const glow = document.createElement('span');
      glow.className = 'spotlight-glow';
      el.appendChild(glow);

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--spotlight-x', `${((e.clientX - rect.left) / rect.width)  * 100}%`);
        el.style.setProperty('--spotlight-y', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
        el.classList.add('spotlight-active');
      });

      el.addEventListener('mouseleave', () => el.classList.remove('spotlight-active'));
    });
  }

});
