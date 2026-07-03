import './contact-form.ts';

function initPortfolioMotion(): void {
  if (typeof window === 'undefined') return;

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.topnav nav a');
  let layoutCache: {
    docH: number;
    hero: { top: number; bottom: number } | null;
    workTop: number;
    aboutTop: number;
    contactTop: number;
    sectionTops: { id: string; top: number }[];
  } | null = null;

  function measureLayout(): void {
    const heroEl = document.querySelector('[data-od-id="hero"]') as HTMLElement | null;
    const workEl = document.getElementById('work');
    const aboutEl = document.getElementById('about');
    const contactEl = document.getElementById('contact');
    layoutCache = {
      docH: document.documentElement.scrollHeight - window.innerHeight,
      hero: heroEl
        ? { top: heroEl.offsetTop, bottom: heroEl.offsetTop + heroEl.offsetHeight }
        : null,
      workTop: workEl ? workEl.offsetTop : 0,
      aboutTop: aboutEl ? aboutEl.offsetTop : 0,
      contactTop: contactEl ? contactEl.offsetTop : 0,
      sectionTops: Array.from(sections).map((sec) => ({
        id: sec.id,
        top: (sec as HTMLElement).offsetTop,
      })),
    };
  }

  function updateNav(): void {
    const scrollY = window.scrollY + 120;
    let current = '';
    const sectionTops = layoutCache?.sectionTops ?? [];
    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
    if (nearBottom && sectionTops.length) {
      current = sectionTops[sectionTops.length - 1].id;
    } else {
      for (const { id, top } of sectionTops) {
        if (top <= scrollY) current = id;
      }
    }
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  const heroAmbient = document.querySelector('[data-od-id="hero-ambient"]');
  const heroSectionEl = document.querySelector('[data-od-id="hero"]');
  if (heroAmbient && heroSectionEl && 'IntersectionObserver' in window) {
    const ambientObserver = new IntersectionObserver(
      (entries) => {
        heroAmbient.classList.toggle('is-paused', !entries[0].isIntersecting);
      },
      { threshold: 0.05, rootMargin: '40px 0px' },
    );
    ambientObserver.observe(heroSectionEl);
  }

  function clampHandoff(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
  }

  function smoothHandoff(t: number): number {
    return t * t * (3 - 2 * t);
  }

  function initSectionHandoffs(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('[data-od-id="hero"]') as HTMLElement | null;
    const work = document.getElementById('work');
    const about = document.getElementById('about');
    const contact = document.getElementById('contact');
    let scrollTicking = false;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    measureLayout();

    function applyHandoffs(): void {
      if (reducedMotion) {
        updateNav();
        return;
      }

      if (!layoutCache) measureLayout();
      const cache = layoutCache!;
      const scrollY = window.scrollY;
      let docH = cache.docH;
      if (docH <= 0) {
        docH = document.documentElement.scrollHeight - window.innerHeight;
        cache.docH = docH;
      }
      const progress = docH > 0 ? scrollY / docH : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(progress));

      if (hero && work && cache.hero) {
        const workTop = cache.workTop;
        const heroBottom = cache.hero.bottom;
        const bridgeStart = heroBottom - window.innerHeight * 0.38;
        const bridgeEnd = workTop + 140;
        const bridgeT = smoothHandoff(
          clampHandoff((scrollY - bridgeStart) / (bridgeEnd - bridgeStart), 0, 1),
        );
        hero.style.setProperty('--hero-work-bridge', String(bridgeT));
        work.style.setProperty('--work-wake', String(bridgeT));
      }

      if (about) {
        const aboutTop = cache.aboutTop;
        const aboutStart = aboutTop - window.innerHeight * 0.58;
        const aboutEnd = aboutTop - window.innerHeight * 0.12;
        const aboutT = smoothHandoff(
          clampHandoff((scrollY - aboutStart) / (aboutEnd - aboutStart), 0, 1),
        );
        about.style.setProperty('--about-breathe', (aboutT * 28).toFixed(1));
        about.style.setProperty('--about-bg-fade', String(aboutT * 0.32));
        about.style.setProperty('--about-parallax', String(1 - aboutT));
      }

      if (contact) {
        const contactTop = cache.contactTop;
        const contactStart = contactTop - window.innerHeight * 0.52;
        const contactEnd = contactTop - window.innerHeight * 0.08;
        const contactT = smoothHandoff(
          clampHandoff((scrollY - contactStart) / (contactEnd - contactStart), 0, 1),
        );
        contact.style.setProperty('--contact-settle', String(contactT));
      }

      updateNav();
    }

    function onScrollFrame(): void {
      scrollTicking = false;
      applyHandoffs();
    }

    function onScroll(): void {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollFrame);
      }
    }

    function onResize(): void {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measureLayout();
        applyHandoffs();
      }, 120);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    if (reducedMotion) {
      document.documentElement.style.setProperty('--scroll-progress', '0');
    }
    applyHandoffs();
  }

  initSectionHandoffs();

  const motionOk = !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.reveal');
  if (motionOk) {
    let pendingReveals = revealTargets.length;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            pendingReveals -= 1;
            if (pendingReveals <= 0) observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
}

initPortfolioMotion();
