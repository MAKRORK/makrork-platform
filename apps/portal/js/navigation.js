'use strict';
(() => {
  const { $, makeLink } = window.Makrork;
  function renderNavigation(site, projects, page) {
    const list = $('#nav-list');
    function closeDropdowns(except) {
      list.querySelectorAll('.dropdown-toggle').forEach(button => {
        if (button === except) return;
        button.setAttribute('aria-expanded', 'false');
        document.getElementById(button.getAttribute('aria-controls')).hidden = true;
      });
    }
    function positionDropdown(button, panel) {
      const r = button.getBoundingClientRect();
      const width = Math.min(320, innerWidth - 24);
      panel.style.width = `${width}px`;
      panel.style.left = `${Math.max(12, Math.min(innerWidth - width - 12, r.left + r.width / 2 - width / 2))}px`;
      const top = $('.site-header').getBoundingClientRect().bottom + 8;
      panel.style.top = `${top}px`;
      panel.style.maxHeight = `${Math.max(44, innerHeight - top - ($('.site-footer')?.getBoundingClientRect().height || 0) - 16)}px`;
    }
    site.navigation.forEach((item, index) => {
      if (Array.isArray(item.pages) && !item.pages.includes(page)) return;
      const li = document.createElement('li'); li.className = 'nav-item';
      // Existing Links menu entries automatically use the same data as the footer.
      // source can also be set explicitly if the menu label is renamed.
      const isSocialMenu = item.source === 'socialLinks' || item.label?.trim().toLowerCase() === 'links';
      const children = isSocialMenu ? (site.socialLinks || [])
        : item.projectType ? projects.filter(p => p.type === item.projectType).map(p => ({ ...p, label: p.title })) : item.items;
      if (Array.isArray(children)) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'dropdown-toggle'; button.textContent = item.label;
        button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', `dropdown-${index}`);
        const panel = document.createElement('ul'); panel.id = `dropdown-${index}`; panel.className = 'dropdown'; panel.hidden = true;
        children.forEach(child => {
          const link = makeLink(child); if (!link) return;
          const row = document.createElement('li'); row.append(link); panel.append(row);
        });
        if (!panel.children.length) {
          const row = document.createElement('li'); row.className = 'dropdown-empty'; row.textContent = isSocialMenu ? 'No links yet' : 'No projects yet'; panel.append(row);
        }
        const open = () => { closeDropdowns(button); positionDropdown(button, panel); panel.hidden = false; button.setAttribute('aria-expanded', 'true'); };
        button.addEventListener('click', () => panel.hidden ? open() : closeDropdowns());
        button.addEventListener('keydown', event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); open();
            const links = panel.querySelectorAll('a');
            links[event.key === 'ArrowDown' ? 0 : links.length - 1]?.focus();
          }
        });
        panel.addEventListener('keydown', event => {
          const links = [...panel.querySelectorAll('a')]; if (!links.length) return;
          const current = links.indexOf(document.activeElement);
          const keys = { ArrowDown: (current + 1) % links.length, ArrowUp: (current - 1 + links.length) % links.length, Home: 0, End: links.length - 1 };
          if (event.key in keys) { event.preventDefault(); links[keys[event.key]].focus(); }
        });
        li.append(button, panel);
      } else {
        const link = makeLink(item, 'nav-link'); if (!link) return;
        if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current', 'page');
        li.append(link);
      }
      list.append(li);
    });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeDropdowns(); });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const active = list.querySelector('[aria-expanded="true"]'); closeDropdowns(); active?.focus();
    });
    // Mobile browser chrome/keyboard can resize the viewport during a tap.
    // Only a width change invalidates the navigation layout.
    let viewportWidth = innerWidth;
    window.addEventListener('resize', () => {
      if (innerWidth !== viewportWidth) {
        viewportWidth = innerWidth;
        closeDropdowns();
        return;
      }
      const active = list.querySelector('.dropdown-toggle[aria-expanded="true"]');
      if (active) positionDropdown(active, document.getElementById(active.getAttribute('aria-controls')));
    }, { passive: true });
  }
  function renderSocials(site) {
    const container = $('#social-links');
    if (document.body.dataset.page === 'explore') {
      // Explore has its social links in the Links dropdown, not at the bottom.
      $('.site-footer')?.remove();
      document.documentElement.style.setProperty('--footer-height', '0px');
      return;
    }
    if (!container) return;
    container.replaceChildren();
    (site.socialLinks || []).forEach(item => {
      const a = window.Makrork.makeIconLink(item, 'social-link', 'social-icon', 'social-label');
      if (a) container.append(a);
    });
  }
  function observeShell() {
    const update = () => {
      document.documentElement.style.setProperty('--header-height', `${Math.ceil($('.site-header').getBoundingClientRect().height)}px`);
      document.documentElement.style.setProperty('--footer-height', `${Math.ceil($('.site-footer')?.getBoundingClientRect().height || 0)}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe($('.site-header'));
    const footer = $('.site-footer');
    if (footer) observer.observe(footer);
    update();
  }
  Object.assign(window.Makrork, { renderNavigation, renderSocials, observeShell });
})();
