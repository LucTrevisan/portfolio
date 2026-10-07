import { h } from '../lib/dom.js';
import { icons } from '../lib/icons.js';

/**
 * Chips de filtro (seleção única). Estado ativo indicado por ícone de
 * check + aria-pressed, não apenas por cor.
 */
export function Filters({ filters, counts, onChange }) {
  const all = [{ id: 'all', label: 'Todos' }, ...filters];

  const buttons = all.map((f) => {
    const count = f.id === 'all' ? null : counts[f.id] ?? 0;
    const btn = h(
      'button',
      {
        type: 'button',
        class: 'chip',
        'aria-pressed': 'false',
        dataset: { filter: f.id },
        disabled: count === 0 ? true : null,
      },
      h('span', { class: 'chip__check', html: icons.check(14) }),
      h('span', {}, f.label),
      count != null ? h('span', { class: 'chip__count mono' }, String(count)) : null
    );
    btn.addEventListener('click', () => onChange(f.id === 'all' ? null : f.id));
    return btn;
  });

  const el = h(
    'div',
    { class: 'filters', role: 'group', 'aria-label': 'Filtrar experiências' },
    h('span', { class: 'filters__label', 'aria-hidden': 'true' }, 'Filtrar'),
    h('div', { class: 'filters__scroller' }, buttons)
  );

  return {
    el,
    setActive(id) {
      for (const b of buttons) {
        const on = (b.dataset.filter === 'all' && !id) || b.dataset.filter === id;
        b.setAttribute('aria-pressed', String(on));
      }
    },
  };
}
