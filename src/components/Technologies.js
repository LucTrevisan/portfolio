import { h } from '../lib/dom.js';
import { icons } from '../lib/icons.js';
import { matchesFilter } from '../lib/catalog.js';

/**
 * Tecnologias + Sobre. Cada bloco mostra quantas experiências do catálogo
 * usam a tecnologia (calculado dos dados) e filtra o catálogo ao clicar.
 */
const TECH = [
  {
    filter: 'babylon',
    icon: 'cube',
    title: 'Babylon.js',
    text: 'Motor 3D open source para a web, base das experiências do catálogo.',
  },
  {
    filter: 'webxr',
    icon: 'headset',
    title: 'WebXR',
    text: 'Padrão aberto do navegador para Realidade Virtual e Aumentada, sem instalar aplicativo.',
  },
  {
    filter: 'digital-twin',
    icon: 'twin',
    title: 'Digital Twins',
    text: 'Réplicas digitais que acompanham equipamentos físicos em tempo real.',
  },
  {
    filter: 'iot',
    icon: 'signal',
    title: 'IoT',
    text: 'Integração com ESP32 e MQTT para telemetria e controle.',
  },
];

export function Technologies({ projects, filters, onFilter }) {
  const items = TECH.map((t) => {
    const f = filters.find((x) => x.id === t.filter);
    const n = f ? projects.filter((p) => matchesFilter(p, f)).length : 0;
    const btn = h(
      'button',
      { type: 'button', class: 'tech', disabled: n === 0 ? true : null },
      h('span', { class: 'tech__icon', html: icons[t.icon](24) }),
      h('span', { class: 'tech__title' }, t.title),
      h('span', { class: 'tech__text' }, t.text),
      h('span', { class: 'tech__count mono' }, `${n} ${n === 1 ? 'experiência' : 'experiências'} →`)
    );
    btn.addEventListener('click', () => onFilter(t.filter));
    return h('li', {}, btn);
  });

  const el = h(
    'div',
    { class: 'info' },
    h(
      'section',
      { class: 'techs container', id: 'tecnologias', 'aria-labelledby': 'tech-title' },
      h(
        'div',
        { class: 'section-head' },
        h('p', { class: 'eyebrow' }, 'Tecnologias'),
        h('h2', { class: 'section-title', id: 'tech-title' }, 'Abertas, na web, sem instalação'),
        h('p', { class: 'section-lead' }, 'Selecione uma tecnologia para ver as experiências que a utilizam.')
      ),
      h('ul', { class: 'techs__grid', role: 'list' }, items)
    ),
    h(
      'section',
      { class: 'about container', id: 'sobre', 'aria-labelledby': 'about-title' },
      h('p', { class: 'eyebrow' }, 'Sobre'),
      h('h2', { class: 'section-title', id: 'about-title' }, 'Tecnologia + Educação + Indústria'),
      h(
        'p',
        { class: 'section-lead' },
        'O XR LAB reúne simuladores de montagem, gêmeos digitais e demonstrações WebXR que rodam direto no navegador — do computador ao headset.'
      )
    )
  );

  return { el };
}
