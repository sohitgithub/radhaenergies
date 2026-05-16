(function () {
  'use strict';

  const ICONS = {
    solar: { src: 'wxnxiano.json' },
    home: { src: 'eszyyflr.json' },
    building: { src: 'etwtznjn.json' },
    factory: { src: 'gqzfzudn.json' },
    tools: { src: 'xwsshppp.json' },
    bolt: { src: 'oalavwuy.json' },
    ev: { src: 'rmojrruu.json' },
    leaf: { src: 'zruicren.json' },
    eco: { src: 'gsqxdxog.json' },
    shield: { src: 'sjoccsdj.json' },
    check: { src: 'oqdmuxru.json' },
    globe: { src: 'kbtmbyzy.json' },
    pin: { src: 'fihkmkwt.json' },
    phone: { src: 'rpfvkyur.json' },
    email: { src: 'diihvcfp.json' },
    sun: { src: 'ygxwvfal.json' },
    cert: { src: 'lupuorrc.json' },
    school: { src: 'jkzgirfe.json' },
    shop: { src: 'rwotyanb.json' },
    hospital: { src: 'abvsilfc.json' },
    chart: { src: 'dmleiypb.json' },
    speed: { src: 'ldjnnyrh.json' },
    user: { src: 'khhpwlig.json' },
    userAlt: { src: 'dkqmvndp.json' },
    engineer: { src: 'lbjvirep.json' },
    scientist: { src: 'dkqmvndp.json' },
    moon: { src: 'exymduqj.json' },
    sunMode: { src: 'ygxwvfal.json' },
    whatsapp: { src: 'aksvbzfv.json' },
    linkedin: { src: 'keaiwnwm.json' },
    instagram: { src: 'igpsgesd.json' },
    facebook: { src: 'bndfoihg.json' },
    twitter: { src: 'nidhidug.json' },
    energy: { src: 'msoeawqm.json' },
    savings: { src: 'rvqsight.json' },
    co2: { src: 'pyyimerq.json' },
  };

  const SIZES = { xs: 20, sm: 28, md: 36, lg: 48, xl: 72, hero: 120 };

  function getColorScheme(scheme) {
    const root = getComputedStyle(document.documentElement);
    const blue = root.getPropertyValue('--electric-blue').trim() || '#00b8e6';
    const gold = root.getPropertyValue('--solar-yellow').trim() || '#ffd700';
    if (scheme === 'light') return 'primary:#ffffff,secondary:#ffd700';
    if (scheme === 'soft') return 'primary:#5ce1ff,secondary:#ffae00';
    return `primary:${blue},secondary:${gold}`;
  }

  function createLordIcon(name, options) {
    const config = ICONS[name];
    if (!config) return null;
    const el = document.createElement('lord-icon');
    el.className = 'lord-icon';
    el.setAttribute('src', `https://cdn.lordicon.com/${config.src}`);
    el.setAttribute('trigger', options.trigger || config.trigger || 'hover');
    if (options.stroke) el.setAttribute('stroke', options.stroke);
    el.setAttribute('colors', getColorScheme(options.scheme || 'brand'));
    const px = SIZES[options.size] || options.px || SIZES.md;
    el.style.width = `${px}px`;
    el.style.height = `${px}px`;
    return el;
  }

  function mountContainer(container) {
    if (container.dataset.iconMounted === 'true') return;
    const name = container.dataset.icon;
    if (!name) return;
    const icon = createLordIcon(name, {
      trigger: container.dataset.trigger,
      scheme: container.dataset.colors,
      size: container.dataset.size,
      stroke: container.dataset.stroke,
    });
    if (!icon) return;
    container.appendChild(icon);
    container.dataset.iconMounted = 'true';
    container._lordIcon = icon;
  }

  function refreshColors() {
    document.querySelectorAll('[data-icon-mounted="true"]').forEach((container) => {
      if (container._lordIcon) {
        container._lordIcon.setAttribute('colors', getColorScheme(container.dataset.colors || 'brand'));
      }
    });
  }

  function mountThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn || btn.dataset.iconMounted === 'true') return;
    btn.textContent = '';
    const isLight = document.documentElement.getAttribute('data-theme') !== 'dark';
    const icon = createLordIcon(isLight ? 'moon' : 'sunMode', {
      trigger: 'hover',
      scheme: 'brand',
      size: 'sm',
    });
    if (icon) {
      btn.appendChild(icon);
      btn._lordIcon = icon;
      btn.dataset.iconMounted = 'true';
    }
  }

  function updateThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const isLight = document.documentElement.getAttribute('data-theme') !== 'dark';
    const name = isLight ? 'moon' : 'sunMode';
    if (btn._lordIcon) btn._lordIcon.remove();
    btn.dataset.iconMounted = 'false';
    btn.textContent = '';
    const icon = createLordIcon(name, { trigger: 'hover', scheme: 'brand', size: 'sm' });
    if (icon) {
      btn.appendChild(icon);
      btn._lordIcon = icon;
      btn.dataset.iconMounted = 'true';
    }
  }

  function playInViewIcons() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const icon = entry.target._lordIcon || entry.target.querySelector('lord-icon');
          if (icon && typeof icon.play === 'function') icon.play();
        });
      },
      { threshold: 0.35 }
    );
    document.querySelectorAll('[data-icon-animate="in"]').forEach((el) => {
      observer.observe(el.closest('[data-icon]') || el);
    });
  }

  function init() {
    if (typeof customElements === 'undefined' || !customElements.get('lord-icon')) {
      setTimeout(init, 80);
      return;
    }
    document.querySelectorAll('[data-icon]').forEach(mountContainer);
    mountThemeToggle();
    playInViewIcons();

    document.querySelectorAll('.glass-card, .trust-item, .project-card, .contact-float-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('lord-icon');
        if (icon && typeof icon.play === 'function') icon.play();
      });
    });

    document.querySelectorAll('[data-trigger="loop"]').forEach((container) => {
      const icon = container._lordIcon || container.querySelector('lord-icon');
      if (icon && typeof icon.play === 'function') {
        setInterval(() => icon.play(), 4000);
      }
    });
  }

  window.RadhaIcons = {
    refreshColors,
    updateThemeToggle,
    createLordIcon,
    mountContainer,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
