import { projects as rawProjects, categories, filters, site } from './data/projects.js';
import { normalizeProjects } from './lib/catalog.js';
import { h, prefersReducedMotion } from './lib/dom.js';
import { Header } from './components/Header.js';
import { Search } from './components/Search.js';
import { Hero } from './components/Hero.js';
import { Catalog } from './components/Catalog.js';
import { Technologies } from './components/Technologies.js';
import { ProjectModal } from './components/ProjectModal.js';
import { Footer } from './components/Footer.js';

const NAV = [
  { label: 'Início', target: 'inicio' },
  { label: 'Experiências', target: 'experiencias' },
  { label: 'Digital Twins', target: 'cat-digital-twin' },
  { label: 'VR', target: 'cat-vr' },
  { label: 'AR', target: 'cat-ar' },
  { label: 'IoT', target: 'cat-iot' },
];

export function App(root) {
  const projects = normalizeProjects(rawProjects, categories);
  const byId = new Map(projects.map((p) => [p.id, p]));
  const validFilter = (id) => (filters.some((f) => f.id === id) ? id : null);
  const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

  /* ---------- Estado (espelhado na URL: ?q=&f=&p=) ---------- */
  const params = new URLSearchParams(location.search);
  const state = {
    query: params.get('q') || '',
    filterId: validFilter(params.get('f')),
  };

  /* ---------- Componentes ---------- */
  const search = Search({
    onInput: (q) => setState({ query: q }, { reveal: true }),
    onSubmit: () => {
      header.closePanels();
      scrollToCatalog();
    },
  });

  const header = Header({ site, nav: NAV, search, onNavigate: navigate });

  const heroProject = byId.get(site.hero?.projectId) || projects.find((p) => p.featured) || projects[0];
  const hero = Hero({
    site,
    project: heroProject,
    onExplore: () => scrollToId('experiencias'),
    onTechnologies: () => scrollToId('tecnologias'),
    onOpenProject: openProject,
  });

  const catalog = Catalog({
    projects,
    categories,
    filters,
    reducedMotion: prefersReducedMotion,
    onOpen: openProject,
    onFilter: (id) => setState({ filterId: id }, { keepCatalogInView: true }),
    onClear: () => {
      setState({ query: '', filterId: null }, { keepCatalogInView: true });
      catalog.el.querySelector('.chip')?.focus({ preventScroll: true });
    },
  });

  const techs = Technologies({
    projects,
    filters,
    onFilter: (id) => {
      setState({ filterId: id, query: '' });
      scrollToCatalog();
    },
  });

  const modal = ProjectModal({ categories, reducedMotion: prefersReducedMotion, onRequestClose: closeProject });
  const footer = Footer({ site, onNavigate: navigate });
  const toast = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });

  // Nav: remove links de categorias sem projetos (linhas inexistentes).
  for (const a of header.el.querySelectorAll('.nav__link')) {
    const t = a.dataset.target;
    if (t.startsWith('cat-') && !catalog.rowIds.includes(t)) a.parentElement.remove();
  }

  root.replaceChildren(
    header.el,
    h('main', { id: 'conteudo' }, hero.el, catalog.el, techs.el),
    footer.el,
    modal.el,
    toast
  );

  injectStructuredData(projects);

  /* ---------- Estado → interface ---------- */
  function render() {
    search.setValue(state.query);
    catalog.render(state, {
      onRemoveQuery: () => setState({ query: '' }, { keepCatalogInView: true }),
      onRemoveFilter: () => setState({ filterId: null }, { keepCatalogInView: true }),
    });
    updateSpy();
  }

  function setState(patch, { reveal = false, keepCatalogInView = false } = {}) {
    const wasActive = Boolean(state.query.trim() || state.filterId);
    Object.assign(state, patch);
    const isActive = Boolean(state.query.trim() || state.filterId);
    render();
    writeUrl();
    // Ao começar a buscar, traz os resultados para a tela.
    if (reveal && isActive && !wasActive) scrollToCatalog();
    if (keepCatalogInView && catalog.el.getBoundingClientRect().top < 0) scrollToCatalog();
  }

  function writeUrl() {
    const u = new URL(location.href);
    state.query.trim() ? u.searchParams.set('q', state.query.trim()) : u.searchParams.delete('q');
    state.filterId ? u.searchParams.set('f', state.filterId) : u.searchParams.delete('f');
    history.replaceState(history.state, '', u);
  }

  /* ---------- Navegação ---------- */
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'inicio') window.scrollTo({ top: 0, behavior: scrollBehavior() });
    else el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    // Move o foco para a seção de destino (teclado / leitor de tela).
    const focusTarget = el.querySelector('h1, h2');
    if (focusTarget) {
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }
  }

  function scrollToCatalog() {
    catalog.el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  function navigate(target) {
    // Linhas de categoria só existem no modo navegação: limpa busca/filtro.
    if (target.startsWith('cat-') && (state.query || state.filterId)) setState({ query: '', filterId: null });
    scrollToId(target);
  }

  /* ---------- Modal + histórico (Back fecha o modal) ---------- */
  function openProject(id, from) {
    const project = byId.get(id);
    if (!project) return;
    const u = new URL(location.href);
    u.searchParams.set('p', id);
    if (history.state?.modal) history.replaceState({ modal: id }, '', u);
    else history.pushState({ modal: id }, '', u);
    modal.open(project, from);
  }

  function closeProject() {
    if (history.state?.modal) {
      history.back(); // popstate fecha o modal
    } else {
      const u = new URL(location.href);
      u.searchParams.delete('p');
      history.replaceState(null, '', u);
      modal.close();
    }
  }

  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(location.search);
    const id = p.get('p');
    if (id && byId.has(id)) modal.open(byId.get(id));
    else modal.close();
    const q = p.get('q') || '';
    const f = validFilter(p.get('f'));
    if (q !== state.query || f !== state.filterId) {
      Object.assign(state, { query: q, filterId: f });
      render();
    }
  });

  /* ---------- Item ativo do menu (scroll-spy) ---------- */
  const spyTargets = () =>
    [document.getElementById('inicio'), catalog.el, ...catalog.el.querySelectorAll('.row, .all'), document.getElementById('tecnologias')].filter(
      (el) => el && el.offsetParent !== null
    );
  const navTargets = new Set(NAV.map((n) => n.target));

  function updateSpy() {
    const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64) + 80;
    let current = 'inicio';
    for (const el of spyTargets()) {
      if (el.getBoundingClientRect().top <= line) current = el.id;
    }
    if (current === 'tecnologias' || current === 'sobre') current = null;
    else if (!navTargets.has(current)) current = 'experiencias';
    header.setActive(current);
  }

  let spyRaf = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (!spyRaf) spyRaf = requestAnimationFrame(() => ((spyRaf = 0), updateSpy()));
    },
    { passive: true }
  );

  /* ---------- Início ---------- */
  render();
  if (state.query || state.filterId) requestAnimationFrame(scrollToCatalog);

  const initial = params.get('p');
  if (initial) {
    if (byId.has(initial)) {
      modal.open(byId.get(initial));
    } else {
      const u = new URL(location.href);
      u.searchParams.delete('p');
      history.replaceState(null, '', u);
      showToast('Experiência não encontrada. Exibindo o catálogo completo.');
    }
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 4000);
  }
}

/** Dados estruturados (schema.org) gerados a partir do catálogo. */
function injectStructuredData(projects) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Experiências XR LAB',
    itemListElement: projects
      .filter((p) => p.url)
      .map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'WebApplication',
          name: p.title,
          description: p.description,
          url: p.url,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          ...(p.image ? { image: new URL(p.image, location.href).href } : {}),
        },
      })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.append(s);
}
