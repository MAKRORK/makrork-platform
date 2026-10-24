'use strict';
(() => {
  const app = window.Makrork;
  app.initHero();
  app.loadData().then(({ site, projects }) => {
    const page = document.body.dataset.page;
    if (page === 'home' && site.brand) document.querySelectorAll('.hero-word, .hero h1').forEach(el => { el.textContent = site.brand; });
    app.renderNavigation(site, projects, page);
    app.renderSocials(site);
    app.observeShell();
    app.initProfilePage?.(site);
    if (page === 'explore') app.initExplore(projects);
  }).catch(error => {
    console.error(error);
    app.$('#load-error').textContent = 'Could not load site content. Check data/site.json and data/projects.json.';
    app.$('#load-error').hidden = false;
  });
})();
