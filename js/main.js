/* ============================================================
   HIS — Hidayah International School
   Global JS — Premium Redesign
   ============================================================ */

/* ── NOTICE BOARD DATA ──
   Edit this array to add/remove notices.
   Fields: title (required), date, category, link (optional, for PDF/page), isNew (bool)
   Leave array empty [] to show "No notices available." message.
   ──────────────────────────────────────────────────────────── */
const notices = [
  // {
  //   title: "Admissions Open for Academic Year 2026–27",
  //   date: "09 Jul 2026",
  //   category: "Admissions",
  //   link: "admissions",
  //   isNew: true
  // },
  // {
  //   title: "Parent-Teacher Meeting — Classes I to VII",
  //   date: "14 Jul 2026",
  //   category: "Events",
  //   link: "",
  //   isNew: true
  // }
];

document.addEventListener('DOMContentLoaded', () => {

  /* ── BODY FADE-IN ── */
  document.body.classList.add('loaded');

  /* ── NAVBAR SCROLL ── */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    const btt = document.querySelector('.back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 300);
    updateBttProgress();
    updateHeroParallax();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ── FAB ── */
  const fabMain    = document.querySelector('.fab-main');
  const fabActions = document.querySelector('.fab-actions');
  if (fabMain && fabActions) {
    fabMain.addEventListener('click', (e) => {
      const isOpen = fabActions.classList.toggle('open');
      fabMain.classList.toggle('is-open', isOpen);
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
  if (slider) {
    const slides  = slider.querySelectorAll('.hero-slide');
    const dots    = document.querySelectorAll('.slider-dot');
    const btnPrev = document.querySelector('.slider-prev');
    const btnNext = document.querySelector('.slider-next');
    let current = 0, timer;

    const animateWords = (slide) => {
      const h1 = slide.querySelector('h1');
      if (!h1) return;
      if (!h1.dataset.original) h1.dataset.original = h1.innerHTML;
      h1.innerHTML = h1.dataset.original;
      h1.innerHTML = h1.innerHTML
        .replace(/<br\s*\/?>/gi, ' ⏎ ')
        .split(/\s+/)
        .map((word, i) => {
          if (word === '⏎') return '<br>';
          return `<span class="hw" style="animation-delay:${i * 0.09}s">${word}</span>`;
        }).join(' ');
    };

    const goTo = (idx) => {
      const outBg = slides[current].querySelector('.hero-bg');
      if (outBg) outBg.style.transform = '';
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
      animateWords(slides[current]);
    };

    const auto = () => { timer = setInterval(() => goTo(current + 1), 5500); };
    const stop = () => clearInterval(timer);

    if (slides.length) {
      goTo(0); auto();
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
    if (bg) bg.style.transform = `translateY(${scrollY * 0.22}px)`;
  }

  /* ── NOTICE BOARD RENDERER ── */
  const noticeList = document.getElementById('noticeList');
  if (noticeList) {
    if (!notices || notices.length === 0) {
      noticeList.innerHTML = `
        <div class="notice-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p>No notices available. Check back soon.</p>
        </div>`;
    } else {
      const pdfSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
      noticeList.innerHTML = notices.map(n => `
        <div class="notice-item">
          <span class="notice-date">${n.date || ''}</span>
          <div class="notice-body">
            <span class="notice-category">${n.category || 'General'}</span>
            <p class="notice-title">${n.link ? `<a href="${n.link}">${n.title}</a>` : n.title}</p>
          </div>
          <div class="notice-right">
            ${n.isNew ? '<span class="notice-new">New</span>' : ''}
            ${n.link ? `<a href="${n.link}" class="notice-pdf" aria-label="View notice">${pdfSVG}</a>` : ''}
          </div>
        </div>`).join('');
    }
  }

  /* ── STAT COUNTER ANIMATION ── */
  const statNums = document.querySelectorAll('.stat-number[data-target]');
  if (statNums.length) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const step = 16;
      const increments = Math.ceil(duration / step);
      let count = 0;
      const inc = target / increments;
      const timer = setInterval(() => {
        count = Math.min(count + inc, target);
        el.textContent = Math.round(count);
        if (count >= target) clearInterval(timer);
      }, step);
    };
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObserver.observe(el));
  }

  /* ── TESTIMONIALS SLIDER ── */
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    const btnPrev = document.querySelector('.testimonial-prev');
    const btnNext = document.querySelector('.testimonial-next');
    let cur = 0, tTimer;

    // Build dots
    if (dotsContainer) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
        dot.addEventListener('click', () => { tStop(); tGoTo(i); tAuto(); });
        dotsContainer.appendChild(dot);
      });
    }

    const tDots = dotsContainer ? dotsContainer.querySelectorAll('.testimonial-dot') : [];

    const tGoTo = (idx) => {
      cur = (idx + cards.length) % cards.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      tDots.forEach((d, i) => d.classList.toggle('active', i === cur));
    };
    const tAuto = () => { tTimer = setInterval(() => tGoTo(cur + 1), 5000); };
    const tStop = () => clearInterval(tTimer);

    btnPrev?.addEventListener('click', () => { tStop(); tGoTo(cur - 1); tAuto(); });
    btnNext?.addEventListener('click', () => { tStop(); tGoTo(cur + 1); tAuto(); });
    tAuto();
  }

  /* ── ACCORDION (inner pages) ── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
      const isCard = el.closest('.why-grid,.programs-grid,.highlights-row,.life-grid,.academics-pathway,.facilities-grid,.testimonial-card');
      const isLeft  = el.classList.contains('principal-portrait') || el.classList.contains('islamic-content') || el.classList.contains('left-col') || el.classList.contains('adm-overview-img') || el.classList.contains('welcome-image');
      const isRight = el.classList.contains('principal-content')  || el.classList.contains('islamic-visual')  || el.classList.contains('right-col') || el.classList.contains('adm-overview-text') || el.classList.contains('welcome-text');
      if (isCard) el.classList.add('reveal-scale');
      else if (isLeft) el.classList.add('reveal-left');
      else if (isRight) el.classList.add('reveal-right');
    }
    revealObserver.observe(el);
  });

  /* ── STAGGER ── */
  document.querySelectorAll('.stagger').forEach(parent => {
    parent.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu a, .nav-cta').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* ── BACK TO TOP ── */
  const btt = document.querySelector('.back-to-top');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  function updateBttProgress() {
    const bttEl = document.querySelector('.back-to-top');
    if (!bttEl) return;
    const circle = bttEl.querySelector('.btt-progress');
    if (!circle) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const circumference = 2 * Math.PI * 19;
    circle.style.strokeDasharray  = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
  }

  /* ── TOAST UTILITY ── */
  function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed','bottom:32px','left:50%','transform:translateX(-50%) translateY(16px)',
      'background:var(--green)','color:#fff','padding:12px 24px','border-radius:50px',
      'font-size:0.88rem','font-weight:600','font-family:var(--font-body)',
      'box-shadow:0 4px 20px rgba(27,67,50,0.35)','z-index:9999','opacity:0',
      'transition:opacity 0.25s ease,transform 0.25s ease','pointer-events:none','white-space:nowrap',
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }));
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
        '🏫 *New Admission Enquiry — Hidayah International School*','',
        `👦 Student Name: ${studentName}`,`👨‍👩‍👧 Parent Name: ${parentName}`,
        `📞 Phone: ${phone}`,`📋 Class Applying For: ${classApplied}`,
        `📍 Address: ${address}`,`💬 Message: ${message}`,'','_Sent via HIS Website_',
      ].join('\n');
      showToast('Redirecting to WhatsApp…', 1500);
      setTimeout(() => window.open('https://wa.me/917667490559?text=' + encodeURIComponent(waText), '_blank'), 400);
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
        '📩 *New Message — Hidayah International School Website*','',
        `👤 Name: ${name}`,`📞 Phone: ${phone}`,`✉️ Email: ${email}`,`💬 Message: ${message}`,
        '','_Sent via HIS Website_',
      ].join('\n');
      showToast('Redirecting to WhatsApp…', 1500);
      setTimeout(() => window.open('https://wa.me/917667490559?text=' + encodeURIComponent(waText), '_blank'), 400);
    });
  }

  /* ── CUSTOM CURSOR (desktop only) ── */
  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
    document.body.classList.add('has-custom-cursor');
    const dot  = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    const lerp = (a, b, t) => a + (b - a) * t;
    dot.style.opacity = ring.style.opacity = '0';

    const CURSOR_STATES = ['cursor-hover','cursor-heading','cursor-card','cursor-fab','cursor-nav'];
    const setCursorState = (state) => {
      CURSOR_STATES.forEach(s => document.body.classList.remove(s));
      if (state) document.body.classList.add(state);
    };

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.opacity = ring.style.opacity = '';
      dot.style.translate = `${mouseX - 4}px ${mouseY - 4}px`;
    });

    document.addEventListener('mouseover', e => {
      const t = e.target;
      if (t.closest('.fab-main,.fab-btn')) setCursorState('cursor-fab');
      else if (t.closest('.nav-link'))     setCursorState('cursor-nav');
      else if (t.closest('a,button,.btn')) setCursorState('cursor-hover');
      else if (t.closest('h1,h2,h3'))     setCursorState('cursor-heading');
      else if (t.closest('.why-card,.life-card,.facility-card,.pathway-card,.testimonial-card,.program-card,.grade-card,.pillar-card,.infra-card,.cocurr-card,.contact-card,.gallery-item,.hl-card'))
        setCursorState('cursor-card');
      else setCursorState(null);
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    document.addEventListener('click', e => {
      const r = document.createElement('div');
      r.className = 'cursor-ripple';
      r.style.cssText = `left:${e.clientX - 30}px;top:${e.clientY - 30}px`;
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 550);
    });

    document.documentElement.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
    document.documentElement.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = ''; });

    (function animateCursor() {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.translate = `${ringX - 14}px ${ringY - 14}px`;
      requestAnimationFrame(animateCursor);
    })();

    /* Card Spotlight */
    const SPOTLIGHT_SEL = [
      '.why-card','.pathway-card','.facility-card','.life-card',
      '.program-card','.grade-card','.pillar-card','.infra-card',
      '.cocurr-card','.contact-card','.gallery-item','.hl-card',
    ].join(',');
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
