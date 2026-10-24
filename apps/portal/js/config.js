'use strict';
(() => {
  async function readJSON(file) {
    const response = await fetch(`/data/${file}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    return response.json();
  }
  window.Makrork.loadData = async () => {
    const [site, projects] = location.protocol === 'file:'
      ? [window.SITE_FALLBACK, window.PROJECTS_FALLBACK]
      : await Promise.all([readJSON('site'), readJSON('projects')]);
    if (!site || !Array.isArray(site.navigation) || !Array.isArray(projects)) throw new Error('Invalid site data');
    const ids = new Set();
    projects.forEach(project => {
      if (!project.id || ids.has(project.id) || !['game', 'tool', 'app'].includes(project.type) || !window.Makrork.safeURL(project.href)) {
        throw new Error(`Invalid project: ${project.id || '(missing id)'}. Check unique id, type and href.`);
      }
      ids.add(project.id);
    });
    return { site, projects };
  };
})();
