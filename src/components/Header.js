import { h } from '../lib/dom.js';
import { icons, logoMark } from '../lib/icons.js';

/**
 * Header fixo. Transparente sobre o Hero; ao rolar ganha fundo escuro,
 * blur e borda. No mobile: logo + busca + menu.
 */
export function Header({ site, nav, search, onNavigate }) {
  const links = nav.map((item) =>
    h('li', {}, h('a', { class: 'nav__link', href: `#${item.target}`, dataset: { target: item.target } }, item.label))
  );

  const navList = h('ul', { class: 'nav__list', role: 'list' }, links);
  const navEl = h('nav', { class: 'nav', id: 'site-nav', 'aria-label': 'Principal' }, navList);

  const searchBtn = h('button', {
    type: 'button',
    class: 'icon-btn header__search-toggle',
    'aria-label': 'Abrir busca',
    'aria-expanded': 'false',
    'aria-controls': 'header-search',
    html: icons.search(22),
  });

  const menuBtn = h('button', {
    type: 'button',
    class: 'icon-btn header__menu-toggle',
    'aria-label': 'Abrir menu',
    'aria-expanded': 'false',
    'aria-controls': 'site-nav',
    html: icons.menu(22),
  });

  const searchWrap = h('div', { class: 'header__search', id: 'header-search' }, search.el);

  const brand = h(
    'a',
    { class: 'brand', href: '#inicio', 'aria-label': `${site.name} — início` },
    h('span', { class: 'brand__mark', html: logoMark(30) }),
    h(
      'span',
      { class: 'brand__text' },
      h('span', { class: 'brand__name' }, 'XR', h('span', { class: 'brand__name-light' }, ' LAB')),
      h('span', { class: 'brand__tag' }, site.tagline)
    )
  );

  const el = h(
    'header',
    { class: 'header', id: 'top' },
    h('div', { class: 'header__inner' }, brand, navEl, searchWrap, h('div', { class: 'header__actions' }, searchBtn, menuBtn))
  );

  /* ---------- Estado dos painéis mobile ---------- */
  const setMenu = (open) => {
    el.classList.toggle('is-menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuBtn.innerHTML = open ? icons.close(22) : icons.menu(22);
    if (open) setSearch(false);
  };

  const setSearch = (open) => {
    el.classList.toggle('is-search-open', open);
    searchBtn.setAttribute('aria-expanded', String(open));
    searchBtn.setAttribute('aria-label', open ? 'Fechar busca' : 'Abrir busca');
    searchBtn.innerHTML = open ? icons.close(22) : icons.search(22);
    if (open) {
      setMenu(false);
      search.focus();
    }
  };

  menuBtn.addEventListener('click', () => setMenu(!el.classList.contains('is-menu-open')));
  searchBtn.addEventListener('click', () => setSearch(!el.classList.contains('is-search-open')));

  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (el.classList.contains('is-menu-open')) {
      setMenu(false);
      menuBtn.focus();
    } else if (el.classList.contains('is-search-open') && !search.input.value) {
      setSearch(false);
      searchBtn.focus();
    }
  });

  // Fecha o menu ao clicar fora. composedPath() porque o ícone clicado é
  // substituído ao alternar o botão e deixa de estar no DOM.
  document.addEventListener('click', (e) => {
    if (el.classList.contains('is-menu-open') && !e.composedPath().includes(el)) setMenu(false);
  });

  navList.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-target]');
    if (!a) return;
    e.preventDefault();
    setMenu(false);
    onNavigate(a.dataset.target);
  });

  brand.addEventListener('click', (e) => {
    e.preventDefault();
    setMenu(false);
    onNavigate('inicio');
  });

  /* ---------- Fundo ao rolar ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      el.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Item de navegação ativo ---------- */
  const setActive = (target) => {
    for (const a of navList.querySelectorAll('a')) {
      if (a.dataset.target === target) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  return {
    el,
    setActive,
    closePanels() {
      setMenu(false);
      if (!search.input.value) setSearch(false);
    },
  };
}
