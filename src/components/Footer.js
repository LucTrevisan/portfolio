import { h } from '../lib/dom.js';
import { logoMark } from '../lib/icons.js';

export function Footer({ site, onNavigate }) {
  const links = [
    { label: 'Projetos', target: 'experiencias' },
    { label: 'Tecnologias', target: 'tecnologias' },
    { label: 'Sobre', target: 'sobre' },
  ];

  const nav = h(
    'nav',
    { class: 'footer__nav', 'aria-label': 'Rodapé' },
    h(
      'ul',
      { role: 'list' },
      links.map((l) => h('li', {}, h('a', { href: `#${l.target}`, dataset: { target: l.target } }, l.label)))
    )
  );

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-target]');
    if (!a) return;
    e.preventDefault();
    onNavigate(a.dataset.target);
  });

  const el = h(
    'footer',
    { class: 'footer' },
    h(
      'div',
      { class: 'footer__inner container' },
      h(
        'div',
        { class: 'footer__brand' },
        h('p', { class: 'footer__logo' }, h('span', { html: logoMark(26) }), h('span', {}, site.name)),
        h('p', { class: 'footer__text' }, 'Experiências WebXR para', h('br'), 'Educação • Indústria • Pesquisa')
      ),
      nav,
      h('p', { class: 'footer__stack mono' }, 'Babylon.js • WebXR • IoT • Digital Twins')
    ),
    h(
      'div',
      { class: 'footer__base container' },
      h('p', {}, `© ${new Date().getFullYear()} ${site.name}. As experiências abrem em seus endereços originais.`)
    )
  );

  return { el };
}
