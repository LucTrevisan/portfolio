import { h } from '../lib/dom.js';
import { categoryBadge, categoryLabel } from '../lib/catalog.js';

/** Iniciais para o placeholder ("Furadeira XR" → "FX"). */
const monogram = (title) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Placeholder elegante usado quando a imagem não existe ou falha. */
export function Placeholder(project) {
  return h(
    'span',
    { class: 'placeholder', 'aria-hidden': 'true' },
    h('span', { class: 'placeholder__mono' }, monogram(project.title)),
    h('span', { class: 'placeholder__note' }, 'Prévia indisponível')
  );
}

/**
 * Imagem responsiva com fallback. Nunca quebra o layout: em caso de erro,
 * a imagem é trocada pelo placeholder.
 */
export function ProjectImage(project, { sizes, eager = false, alt = '' } = {}) {
  const wrap = h('span', { class: 'media' });
  if (!project.image) {
    wrap.append(Placeholder(project));
    return wrap;
  }
  const img = h('img', {
    src: project.image,
    srcset: project.imageSmall ? `${project.imageSmall} 480w, ${project.image} 960w` : null,
    sizes: project.imageSmall ? sizes : null,
    alt,
    width: 960,
    height: 540,
    loading: eager ? 'eager' : 'lazy',
    decoding: 'async',
  });
  wrap.classList.add('is-loading');
  img.addEventListener('load', () => wrap.classList.remove('is-loading'), { once: true });
  img.addEventListener(
    'error',
    () => {
      wrap.classList.remove('is-loading');
      img.replaceWith(Placeholder(project));
    },
    { once: true }
  );
  wrap.append(img);
  if (img.complete && img.naturalWidth) wrap.classList.remove('is-loading');
  return wrap;
}

/** Badges das categorias (texto visível + nome completo para leitores de tela). */
export function Badges(project, categories, extraClass = '') {
  return h(
    'span',
    { class: `badges ${extraClass}` },
    project.categories.map((c) =>
      h(
        'span',
        { class: 'badge' },
        h('span', { 'aria-hidden': 'true' }, categoryBadge(categories, c)),
        h('span', { class: 'sr-only' }, `${categoryLabel(categories, c)}, `)
      )
    )
  );
}

/**
 * Card do catálogo: link real (?p=id) para que clique do meio, cópia de link
 * e navegação sem JavaScript continuem funcionando; o clique abre o modal.
 */
export function ProjectCard(project, { categories, onOpen, sizes }) {
  const tech = project.technologies.slice(0, 3).join(' • ');

  const link = h(
    'a',
    {
      class: 'card',
      href: `?p=${encodeURIComponent(project.id)}`,
      'aria-haspopup': 'dialog',
      dataset: { id: project.id },
    },
    h(
      'span',
      { class: 'card__media' },
      ProjectImage(project, { sizes }),
      Badges(project, categories, 'card__badges'),
      project.description ? h('span', { class: 'card__reveal' }, project.description) : null
    ),
    h(
      'span',
      { class: 'card__body' },
      h('span', { class: 'card__title' }, project.title),
      tech ? h('span', { class: 'card__tech mono' }, tech) : null
    )
  );

  link.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // abrir em nova aba
    e.preventDefault();
    onOpen(project.id, link);
  });

  return h('li', { class: 'card-item' }, link);
}
