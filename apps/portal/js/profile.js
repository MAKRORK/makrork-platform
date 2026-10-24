'use strict';
(() => {
  window.Makrork.initProfilePage = site => {
    const page = document.querySelector('.profile-page');
    if (!page) return;
    const content = page.querySelector('.profile-content');
    const container = document.getElementById('contact-links');
    if (container) {
      container.replaceChildren();
      (site.contactLinks || []).forEach(item => {
        const link = window.Makrork.makeIconLink(item, 'contact-link', 'contact-icon', 'contact-label');
        if (!link) return;
        const row = document.createElement('li'); row.append(link); container.append(row);
      });
    }
    let frame = 0;
    function fitLayout() {
      frame = 0;
      const w = innerWidth, h = innerHeight, mobile = w <= 760;
      const header = document.querySelector('.site-header').getBoundingClientRect().bottom;
      const footer = h - document.querySelector('.site-footer').getBoundingClientRect().top;
      const gap = mobile ? 12 : 20;
      const topLimit = header + gap;
      // Mobile reserves a separate lower area for the silhouette and its title.
      const artReserve = mobile ? Math.min(330, Math.max(120, h * .35)) : 0;
      const available = Math.max(1, h - footer - gap - topLimit - artReserve);
      const preferred = mobile ? 16 : Math.min(24, Math.max(14, w * .0125));
      content.style.top = `${topLimit}px`;
      const setFont = size => content.style.setProperty('--profile-font-size', `${size}px`);
      setFont(preferred);
      if (content.getBoundingClientRect().height > available) {
        // Fit the real wrapped text, not an estimate of line count. No internal scrolling.
        let low = .5, high = preferred;
        for (let i = 0; i < 16; i++) {
          const middle = (low + high) / 2;
          setFont(middle);
          if (content.getBoundingClientRect().height <= available) low = middle;
          else high = middle;
        }
        setFont(Math.floor(low * 100) / 100);
      }
      const contentHeight = content.getBoundingClientRect().height;
      if (!mobile) {
        const preferredTop = h * (container ? .42 : .46);
        content.style.top = `${Math.max(topLimit, Math.min(preferredTop, h - footer - gap - contentHeight))}px`;
      }
      window.Makrork.refreshHero?.();
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(fitLayout); };
    window.addEventListener('resize', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(document.querySelector('.site-header'));
    observer.observe(document.querySelector('.site-footer'));
    document.fonts.ready.then(schedule);
    fitLayout();
  };
})();
