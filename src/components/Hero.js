import { h } from '../lib/dom.js';
import { icons } from '../lib/icons.js';

/**
 * Hero cinematográfico. A imagem vem de `site.hero` (ou do projeto em
 * destaque). Sem imagem, o fundo procedural (grid + luz) assume.
 */
export function Hero({ site, project, onExplore, onTechnologies, onOpenProject }) {
  const image = site.hero?.image || project?.image;
  const imageSmall = site.hero?.imageSmall || project?.imageSmall;

  const media = h('div', { class: 'hero__media', 'aria-hidden': image ? null : 'true' });
  if (image) {
    const img = h('img', {
      class: 'hero__img',
      src: image,
      srcset: imageSmall ? `${imageSmall} 720w, ${image} 1280w` : null,
      sizes: '100vw',
      alt: project ? `Cena 3D da experiência ${project.title}` : '',
      fetchpriority: 'high',
      decoding: 'async',
      width: 1280,
      height: 720,
    });
    img.addEventListener('error', () => img.remove(), { once: true });
    media.append(img);
  }

  const spotlight = project
    ? h(
        'a',
        { class: 'hero__spotlight', href: `?p=${encodeURIComponent(project.id)}`, 'aria-haspopup': 'dialog' },
        h('span', { class: 'hero__spotlight-label mono' }, 'Em destaque'),
        h('span', { class: 'hero__spotlight-title' }, project.title, project.subtitle ? h('span', {}, ` — ${project.subtitle}`) : null)
      )
    : null;

  spotlight?.addEventListener('click', (e) => {
    e.preventDefault();
    onOpenProject(project.id, spotlight);
  });

  const exploreBtn = h(
    'a',
    { class: 'btn btn--primary', href: '#experiencias' },
    'Explorar experiências',
    h('span', { html: icons.arrowDown(18) })
  );
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    onExplore();
  });

  const techBtn = h('a', { class: 'btn btn--ghost', href: '#tecnologias' }, 'Conhecer tecnologias');
  techBtn.addEventListener('click', (e) => {
    e.preventDefault();
    onTechnologies();
  });

  const el = h(
    'section',
    { class: 'hero', id: 'inicio', 'aria-labelledby': 'hero-title' },
    media,
    h('div', { class: 'hero__fx', 'aria-hidden': 'true' }),
    h(
      'div',
      { class: 'hero__content container' },
      h('p', { class: 'eyebrow hero__eyebrow' }, site.tagline),
      h('p', { class: 'hero__stack mono' }, 'WebXR • Babylon.js • Digital Twins • IoT'),
      h('h1', { class: 'hero__title', id: 'hero-title' }, 'Tecnologia que', h('br'), 'transforma aprendizagem'),
      h(
        'p',
        { class: 'hero__lead' },
        'Explore aplicações interativas desenvolvidas para visualização, simulação e treinamento profissional.'
      ),
      h('div', { class: 'hero__actions' }, exploreBtn, techBtn)
    ),
    spotlight ? h('div', { class: 'hero__foot container' }, spotlight) : null
  );

  return { el };
}
