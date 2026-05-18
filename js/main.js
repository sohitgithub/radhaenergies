(function () {
  'use strict';

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('radha-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('radha-theme', next);
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = next === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  });
  if (themeToggle) {
    const isLight = savedTheme !== 'dark';
    const icon = themeToggle.querySelector('i');
    if (icon) icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }

  // Header scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile menu — panel is moved to <body> so it is not clipped by the header
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.querySelector('.nav');
  const navActions = document.querySelector('.nav-actions');
  const mobileMq = window.matchMedia('(max-width: 768px)');

  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    navBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(navBackdrop);
  }

  if (menuToggle && navLinks) {
    if (!navLinks.id) navLinks.id = 'nav-menu';
    menuToggle.setAttribute('aria-controls', navLinks.id);
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  function isMobileNav() {
    return mobileMq.matches;
  }

  function mountMobileNav() {
    if (!navLinks) return;
    navLinks.classList.add('nav-mobile-panel');
    if (navLinks.parentElement !== document.body) {
      document.body.appendChild(navLinks);
    }
    if (!navLinks.classList.contains('open')) {
      navLinks.setAttribute('aria-hidden', 'true');
    }
  }

  function unmountMobileNav() {
    if (!navLinks || !nav || !navActions) return;
    navLinks.classList.remove('nav-mobile-panel', 'open');
    if (navLinks.parentElement === document.body) {
      nav.insertBefore(navLinks, navActions);
    }
    navLinks.removeAttribute('aria-hidden');
  }

  function setMenuOpen(open) {
    if (!navLinks || !menuToggle) return;
    if (open && !isMobileNav()) return;

    navLinks.classList.toggle('open', open);
    navBackdrop.classList.toggle('is-visible', open);
    menuToggle.classList.toggle('active', open);
    header?.classList.toggle('menu-open', open);
    document.body.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.setAttribute('aria-hidden', open ? 'false' : 'true');
    navBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function syncNavLayout() {
    if (isMobileNav()) {
      mountMobileNav();
    } else {
      setMenuOpen(false);
      unmountMobileNav();
    }
  }

  syncNavLayout();
  mobileMq.addEventListener('change', syncNavLayout);

  menuToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMobileNav()) return;
    setMenuOpen(!navLinks.classList.contains('open'));
  });

  navBackdrop.addEventListener('click', () => setMenuOpen(false));

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });

  // Button ripple, entrance class & magnetic hero CTAs
  function initButtonAnimations() {
    document.querySelectorAll(
      '.btn, .btn-submit, .nav-cta, .quick-btn, .map-directions-btn'
    ).forEach((btn) => {
      btn.classList.add('btn-anim');
      if (btn.dataset.rippleBound) return;
      btn.dataset.rippleBound = 'true';
      btn.addEventListener('click', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }
  initButtonAnimations();

  if (window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)').matches) {
    document.querySelectorAll('.btn-hero').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        btn.style.transform = `translate(${x * 4}px, ${y * 4 - 3}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta-mobile)').forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll reveal (staggered)
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  revealEls.forEach((el, i) => {
    const delay = el.dataset.revealDelay ?? (i % 6) * 0.08;
    el.style.setProperty('--reveal-delay', `${delay}s`);
    revealObserver.observe(el);
  });

  // Hero scroll parallax
  const heroSection = document.querySelector('.hero--banner');
  const heroContent = document.querySelector('.hero--banner .hero-content');
  const heroVisual = document.querySelector('.hero-energy-visual');
  if (heroSection && (heroContent || heroVisual) && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      const y = progress * 48;
      const opacity = 1 - progress * 0.35;
      if (heroContent) {
        heroContent.style.transform = `translateY(${y * 0.4}px)`;
        heroContent.style.opacity = String(opacity);
      }
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${y * 0.65}px)`;
        heroVisual.style.opacity = String(opacity);
      }
    }, { passive: true });
  }

  // Live kW ticker in hero
  const kwEl = document.querySelector('[data-hero-kw]');
  if (kwEl) {
    let kw = 3.6;
    setInterval(() => {
      kw = Math.min(4.2, Math.max(3.1, kw + (Math.random() - 0.48) * 0.08));
      kwEl.textContent = kw.toFixed(1);
    }, 2200);
  }

  // Animated counters
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

  // Parallax
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // 3D panel tilt
  document.querySelectorAll('.panel-stack').forEach((stack) => {
    stack.addEventListener('mousemove', (e) => {
      const rect = stack.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stack.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
    });
    stack.addEventListener('mouseleave', () => {
      stack.style.transform = '';
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach((open) => {
        if (open !== item) {
          open.classList.remove('active');
          open.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      item.classList.toggle('active', !isActive);
      answer.style.maxHeight = !isActive ? answer.scrollHeight + 'px' : null;
    });
  });

  // Page transitions
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    if (link.hostname && link.hostname !== window.location.hostname) return;
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      const overlay = document.querySelector('.page-transition');
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 500);
      } else {
        window.location.href = href;
      }
    });
  });

  // Contact form (Formspree)
  document.querySelector('.contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.btn-submit');
    const original = btn.textContent;
    const originalBg = btn.style.background;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Submit failed');

      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = originalBg;
        btn.disabled = false;
      }, 3000);
    } catch {
      btn.textContent = 'Failed — try again';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = originalBg;
        btn.disabled = false;
      }, 3000);
    }
  });

  // Solar rays in hero
  const raysContainer = document.querySelector('.hero-solar-rays');
  if (raysContainer) {
    for (let i = 0; i < 12; i++) {
      const ray = document.createElement('div');
      ray.className = 'solar-ray';
      ray.style.left = '50%';
      ray.style.top = '50%';
      ray.style.height = '45%';
      ray.style.transformOrigin = 'center bottom';
      ray.style.transform = `translate(-50%, -100%) rotate(${i * 30}deg)`;
      ray.style.animationDelay = `${i * 0.15}s`;
      raysContainer.appendChild(ray);
    }
  }

  // Chart bars stagger
  document.querySelectorAll('.chart-bar').forEach((bar, i) => {
    bar.style.animationDelay = `${i * 0.1}s`;
    bar.style.height = bar.dataset.height || '60%';
  });
})();
