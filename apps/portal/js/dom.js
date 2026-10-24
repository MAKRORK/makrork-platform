'use strict';
window.Makrork = (() => {
  const $ = selector => document.querySelector(selector);
  function safeURL(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ||
        (location.protocol === 'file:' && url.protocol === 'file:') ? url.href : null;
    } catch { return null; }
  }
  function makeLink(item, className = '') {
    const href = safeURL(item.href);
    if (!href) return null;
    const a = document.createElement('a');
    a.href = href; a.className = className; a.textContent = item.label || item.title || 'Link';
    if (item.newTab) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  }
  return { $, safeURL, makeLink };
})();

// Both footer links and contacts accept SVG/PNG/JPG URLs through the same renderer.
(() => {
  function makeIconLink(item, className, iconClass, labelClass) {
    const a = window.Makrork.makeLink(item, className);
    if (!a) return null;
    const label = document.createElement('span');
    label.className = labelClass; label.textContent = item.label || '';
    a.replaceChildren();
    if (window.Makrork.safeURL(item.icon)) {
      const img = document.createElement('img');
      img.src = item.icon; img.className = iconClass; img.alt = '';
      img.setAttribute('aria-hidden', 'true'); img.decoding = 'async';
      img.addEventListener('error', () => { img.remove(); a.classList.add('icon-missing'); });
      a.append(img);
    } else a.classList.add('icon-missing');
    a.append(label);
    return a;
  }
  window.Makrork.makeIconLink = makeIconLink;
})();
