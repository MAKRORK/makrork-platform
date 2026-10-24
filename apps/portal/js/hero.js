'use strict';
(() => {
const { $ } = window.Makrork;
function initHero() {
  const scene = $('#hero-scene');
  if (!scene) return;
  const isProfile = !!$('.profile-page');
  const hero = isProfile ? $('.profile-art') : $('.hero');
  const exploreButton = $('.explore-button');
  const cowboy = $('#cowboy-layer'), mask = $('#cowboy-mask');
  const title = $('#title-layer'), overlay = $('#title-overlay');
  const canMove = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let layout, targetX = 0, targetY = 0, x = 0, y = 0, raf = 0;
  function paint() {
    const transform = `translate(${layout.x + x * 12} ${layout.y + y * 9}) scale(${layout.scale})`;
    cowboy.setAttribute('transform', transform); mask.setAttribute('transform', transform);
    const textTransform = `translate(${x * 32} ${y * 24})`;
    title.setAttribute('transform', textTransform); overlay.setAttribute('transform', textTransform);
    if (exploreButton) exploreButton.style.transform = `translateX(-50%) translate(${x * 32}px, ${y * 24}px)`;
  }
  function tick() {
    x += (targetX - x) * .09; y += (targetY - y) * .09;
    paint();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .001) raf = requestAnimationFrame(tick);
    else raf = 0;
  }
  function animateTo(nx, ny) { targetX = nx; targetY = ny; if (!raf) raf = requestAnimationFrame(tick); }
  function resize() {
    const { width: w, height: h } = hero.getBoundingClientRect();
    const mobile = innerWidth <= 760;
    let scale, textX, textY, fontSize;
    if (isProfile) {
      const content = document.querySelector('.profile-content');
      const contentBottom = content?.getBoundingClientRect().bottom || innerHeight * .5;
      const bleed = Math.max(24, h * .04);
      if (mobile) {
        const artTop = contentBottom + 24;
        const visibleHeight = Math.max(1, h - artTop);
        // Bottom edge stays beyond the viewport regardless of content height.
        const figureHeight = Math.min(w * .68 * 945.1333 / 602.083, visibleHeight + bleed);
        scale = figureHeight / 945.1333;
        layout = { scale, x: -w * .07, y: h + bleed - figureHeight };
        fontSize = Math.min(w / 4.3, visibleHeight * .38);
        textX = w * .5;
        textY = Math.max(artTop + fontSize * .55, layout.y + figureHeight * .30);
      } else {
        scale = Math.min(h * .875 / 945.1333, w * .70 / 602.083);
        layout = { scale, x: -w * .007, y: h + bleed - 945.1333 * scale };
        // Keep the entire title, including its 32px parallax, inside the left column.
        fontSize = Math.min(w / 4.8, Math.max(1, w - 80) / 4.2);
        textX = w * .5;
        textY = Math.max(100, h * .34);
      }
    } else {
      scale = mobile ? h * .71 / 945.1333 : Math.min(h * .875 / 945.1333, w * .47 / 602.083);
      layout = { scale, x: (mobile ? w * .42 : w * .4625) - 602.083 * scale / 2,
        y: h + Math.max(24, h * .04) - 945.1333 * scale };
      textX = w / 2; textY = h * (mobile ? .237 : .5);
      fontSize = mobile ? w / 4.3 : Math.min(w * .15, h * .285);
    }
    scene.setAttribute('viewBox', `0 0 ${w} ${h}`);
    scene.querySelectorAll('text').forEach(el => {
      el.setAttribute('x', textX); el.setAttribute('y', textY);
      el.style.fontSize = `${fontSize}px`;
    });
    paint();
  }
  window.Makrork.refreshHero = resize;
  new ResizeObserver(resize).observe(hero);
  resize();
  window.addEventListener('pointermove', event => {
    if (!canMove.matches || event.pointerType !== 'mouse') return;
    const rect = isProfile ? { left: 0, top: 0, width: innerWidth, height: innerHeight } : hero.getBoundingClientRect();
    animateTo(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)), Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)));
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => animateTo(0, 0));
  window.addEventListener('blur', () => animateTo(0, 0));
  canMove.addEventListener('change', () => {
    if (!canMove.matches) { cancelAnimationFrame(raf); raf = 0; targetX = targetY = x = y = 0; paint(); }
  });
}

window.Makrork.initHero = initHero;
})();
