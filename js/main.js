(function () {
  'use strict';

  // Loader
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hidden'), 1800);
  });

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('radha-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', () => {
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

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
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
  if (heroSection && (heroContent || heroVisual)) {
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
    let kw = 12.4;
    setInterval(() => {
      kw = Math.min(14.2, Math.max(11.8, kw + (Math.random() - 0.48) * 0.15));
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
