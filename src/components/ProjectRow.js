import { h } from '../lib/dom.js';
import { icons } from '../lib/icons.js';
import { ProjectCard } from './ProjectCard.js';

const ROW_SIZES = '(min-width: 1600px) 19vw, (min-width: 1200px) 23vw, (min-width: 900px) 31vw, (min-width: 600px) 46vw, 84vw';

/**
 * Linha horizontal de cards. Swipe nativo (scroll-snap) no toque; setas
 * no desktop. Nunca se move sozinha.
 */
export function ProjectRow(row, ctx, index) {
  const titleId = `${row.id}-title`;
  const track = h(
    'ul',
    { class: 'row__track', role: 'list', 'aria-labelledby': titleId },
    row.projects.map((p) => ProjectCard(p, { ...ctx, sizes: ROW_SIZES }))
  );

  const prev = h('button', { type: 'button', class: 'icon-btn row__arrow', 'aria-label': `Anterior: ${row.title}`, html: icons.chevronLeft(22) });
  const next = h('button', { type: 'button', class: 'icon-btn row__arrow', 'aria-label': `Próximo: ${row.title}`, html: icons.chevronRight(22) });

  const scrollBy = (dir) => {
    const step = Math.max(track.clientWidth * 0.85, 240);
    track.scrollBy({ left: dir * step, behavior: ctx.reducedMotion() ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', () => scrollBy(-1));
  next.addEventListener('click', () => scrollBy(1));

  const controls = h('div', { class: 'row__controls' }, prev, next);

  let raf = 0;
  const update = () => {
    raf = 0;
    const max = track.scrollWidth - track.clientWidth;
    const overflow = max > 4;
    controls.hidden = !overflow;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max - 4;
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  track.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(schedule).observe(track);

  const el = h(
    'section',
    { class: 'row', id: row.id, 'aria-labelledby': titleId, dataset: { category: row.category || '' } },
    h(
      'div',
      { class: 'row__head container' },
      h(
        'h2',
        { class: 'row__title', id: titleId },
        h('span', { class: 'row__index mono', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
        row.title
      ),
      h('span', { class: 'row__count mono' }, `${row.projects.length} ${row.projects.length === 1 ? 'experiência' : 'experiências'}`),
      controls
    ),
    track
  );

  return { el, update: schedule };
}

/** Grade (usada em "Todas as experiências" e nos resultados de busca). */
export function ProjectGrid(projects, ctx, attrs = {}) {
  return h(
    'ul',
    { class: 'grid', role: 'list', ...attrs },
    projects.map((p) =>
      ProjectCard(p, { ...ctx, sizes: '(min-width: 1200px) 24vw, (min-width: 900px) 31vw, (min-width: 600px) 46vw, 92vw' })
    )
  );
}
