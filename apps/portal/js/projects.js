'use strict';
(() => {
  const { $, makeLink, safeURL } = window.Makrork;
  // Future toolbar can call setExploreView({ type: 'game', sort: 'title-asc', search: '' }).
  // No filter controls or automatic category filtering are shown in this version.
  function selectProjects(projects, { type = null, sort = 'default', search = '' } = {}) {
    let result = projects.filter(p => (!type || p.type === type) && `${p.title} ${p.description || ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    if (sort === 'title-asc') result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'title-desc') result.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === 'newest') result.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
    return result;
  }
  function renderProjects(projects) {
    const grid = $('#project-grid'); grid.replaceChildren();
    projects.forEach(item => {
      const article = document.createElement('article'); article.className = 'project-card'; article.id = item.id;
      const link = makeLink(item, 'card-content');
      link.replaceChildren();
      if (safeURL(item.image)) {
        const img = document.createElement('img'); img.src = item.image; img.alt = item.imageAlt || '';
        img.className = 'project-image'; img.width = 370; img.height = 294;
        img.loading = 'lazy'; img.decoding = 'async'; link.append(img);
      }
      const title = document.createElement('h2'); title.className = 'project-title'; title.textContent = item.title;
      const description = document.createElement('p'); description.className = 'project-description'; description.textContent = item.description || '';
      link.append(title, description); article.append(link); grid.append(article);
    });
    $('#empty-state').hidden = projects.length > 0;
  }
  function initExplore(projects) {
    let state = { type: null, sort: 'default', search: '' };
    window.Makrork.setExploreView = (changes = {}) => {
      state = { ...state, ...changes }; renderProjects(selectProjects(projects, state));
      $('#main').scrollTop = 0;
    };
    window.Makrork.setExploreView();
    if (location.hash) {
      try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: 'start' }); } catch { /* Invalid hash. */ }
    }
  }
  Object.assign(window.Makrork, { selectProjects, initExplore });
})();
