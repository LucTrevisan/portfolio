import { h } from '../lib/dom.js';
import { icons } from '../lib/icons.js';
import { buildRows, matchesFilter, matchesQuery } from '../lib/catalog.js';
import { Filters } from './Filters.js';
import { ProjectRow, ProjectGrid } from './ProjectRow.js';

/**
 * Catálogo com dois modos:
 *  - navegação: Destaques + linhas por categoria + Todas as experiências;
 *  - resultados: grade filtrada por busca/filtro, com estado vazio.
 */
export function Catalog({ projects, categories, filters, onOpen, onFilter, onClear, reducedMotion }) {
  const ctx = { categories, onOpen, reducedMotion };

  const counts = Object.fromEntries(filters.map((f) => [f.id, projects.filter((p) => matchesFilter(p, f)).length]));
  const filterBar = Filters({ filters, counts, onChange: onFilter });

  /* ---------- Modo navegação ---------- */
  const rows = buildRows(projects, categories).map((r, i) => ProjectRow(r, ctx, i));
  const allSection = h(
    'section',
    { class: 'all', id: 'todas', 'aria-labelledby': 'todas-title' },
    h(
      'div',
      { class: 'row__head container' },
      h(
        'h2',
        { class: 'row__title', id: 'todas-title' },
        h('span', { class: 'row__index mono', 'aria-hidden': 'true' }, String(rows.length + 1).padStart(2, '0')),
        'Todas as experiências'
      ),
      h('span', { class: 'row__count mono' }, `${projects.length} experiências`)
    ),
    h('div', { class: 'container' }, ProjectGrid(projects, ctx, { 'aria-labelledby': 'todas-title' }))
  );
  const browse = h('div', { class: 'catalog__browse' }, rows.map((r) => r.el), allSection);

  /* ---------- Modo resultados ---------- */
  const resultsTitle = h('h2', { class: 'results__title', id: 'results-title', tabindex: '-1' }, 'Resultados');
  const summary = h('p', { class: 'results__summary' });
  const activeList = h('ul', { class: 'results__active', role: 'list', 'aria-label': 'Filtros ativos' });
  const clearBtn = h('button', { type: 'button', class: 'btn btn--secondary btn--sm' }, 'Limpar filtros');
  clearBtn.addEventListener('click', onClear);
  const resultsBody = h('div', { class: 'results__body' });

  const results = h(
    'section',
    { class: 'results container', 'aria-labelledby': 'results-title', hidden: true },
    h('div', { class: 'results__head' }, h('div', {}, resultsTitle, summary), h('div', { class: 'results__tools' }, activeList, clearBtn)),
    resultsBody
  );

  // Região "viva": anuncia a quantidade de resultados para leitores de tela.
  const live = h('p', { class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });

  const el = h(
    'section',
    { class: 'catalog', id: 'experiencias', 'aria-labelledby': 'catalog-title' },
    h(
      'div',
      { class: 'catalog__bar container' },
      h('h2', { class: 'sr-only', id: 'catalog-title' }, 'Catálogo de experiências'),
      filterBar.el
    ),
    browse,
    results,
    live
  );

  const emptyState = () =>
    h(
      'div',
      { class: 'empty', role: 'status' },
      h('span', { class: 'empty__icon', html: icons.search(28) }),
      h('p', { class: 'empty__title' }, 'Nenhuma experiência encontrada.'),
      h('p', { class: 'empty__text' }, 'Tente outro termo ou remova os filtros.'),
      (() => {
        const b = h('button', { type: 'button', class: 'btn btn--primary' }, 'Limpar filtros');
        b.addEventListener('click', onClear);
        return b;
      })()
    );

  const chip = (label, onRemove) => {
    const b = h('button', { type: 'button', class: 'tag tag--removable', 'aria-label': `Remover ${label}` }, label, h('span', { html: icons.close(14) }));
    b.addEventListener('click', onRemove);
    return h('li', {}, b);
  };

  let lastKey = '';

  return {
    el,
    /** Aplica busca e filtro. Retorna a quantidade de resultados. */
    render({ query, filterId }, { onRemoveQuery, onRemoveFilter }) {
      filterBar.setActive(filterId);
      const filter = filters.find((f) => f.id === filterId) || null;
      const q = query.trim();
      const active = Boolean(q || filter);
      const key = `${q}|${filterId || ''}`;

      browse.hidden = active;
      results.hidden = !active;
      el.classList.toggle('is-filtering', active);

      if (!active) {
        if (lastKey !== key) live.textContent = '';
        lastKey = key;
        rows.forEach((r) => r.update());
        return projects.length;
      }

      const found = projects.filter((p) => matchesFilter(p, filter) && matchesQuery(p, q));
      const n = found.length;
      const noun = n === 1 ? 'experiência encontrada' : 'experiências encontradas';

      summary.textContent = n ? `${n} ${noun}` : 'Nenhum resultado';
      activeList.replaceChildren(
        ...[q ? chip(`Busca: “${q}”`, onRemoveQuery) : null, filter ? chip(`Filtro: ${filter.label}`, onRemoveFilter) : null].filter(Boolean)
      );

      if (key !== lastKey) {
        resultsBody.replaceChildren(n ? ProjectGrid(found, ctx, { 'aria-labelledby': 'results-title' }) : emptyState());
        live.textContent = n ? `${n} ${noun}.` : 'Nenhuma experiência encontrada. Tente outro termo ou remova os filtros.';
      }
      lastKey = key;
      return n;
    },
    rowIds: rows.map((r) => r.el.id),
  };
}
