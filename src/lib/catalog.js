/**
 * Regras do catálogo: normalização, busca, filtros e linhas automáticas.
 * Não contém dados — tudo vem de src/data/projects.js.
 */

/** Remove acentos e caixa para comparação ("Câmera" → "camera"). */
export const fold = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Aceita apenas URLs http(s) válidas; qualquer outra coisa vira null. */
export function safeUrl(value) {
  try {
    const u = new URL(String(value));
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

/** Aceita apenas caminhos de imagem relativos ou http(s). */
function safeImage(value) {
  if (!value || typeof value !== 'string') return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return safeUrl(value);
  return value;
}

const list = (v) => (Array.isArray(v) ? v.filter(Boolean).map(String) : []);

/** Compatibilidade derivada das categorias quando não declarada. */
function deriveCompatibility(cats) {
  const out = ['Navegador com WebGL (desktop e mobile)'];
  if (cats.includes('vr')) out.push('Headset VR compatível com WebXR');
  if (cats.includes('ar')) out.push('Dispositivo com suporte a WebXR AR');
  return out;
}

/**
 * Normaliza e valida os projetos. Entradas inválidas não quebram a página:
 * sem id/título → descartadas (com aviso); URL inválida → `url: null`.
 */
export function normalizeProjects(raw, categories) {
  const seen = new Set();
  const out = [];
  for (const p of Array.isArray(raw) ? raw : []) {
    if (!p || !p.id || !p.title || seen.has(p.id)) {
      console.warn('[XR LAB] Projeto ignorado (id/título ausente ou duplicado):', p);
      continue;
    }
    seen.add(p.id);
    const cats = list(p.categories);
    const project = {
      id: String(p.id),
      title: String(p.title),
      subtitle: p.subtitle ? String(p.subtitle) : '',
      description: p.description ? String(p.description) : '',
      image: safeImage(p.image),
      imageSmall: safeImage(p.imageSmall),
      url: safeUrl(p.url),
      categories: cats,
      technologies: list(p.technologies),
      tags: list(p.tags),
      features: list(p.features),
      compatibility: list(p.compatibility).length ? list(p.compatibility) : deriveCompatibility(cats),
      featured: Boolean(p.featured),
    };
    if (!project.url) console.warn(`[XR LAB] URL inválida em "${project.id}". O botão será desativado.`);
    // Índice de busca pré-calculado (inclui rótulos e sinônimos das categorias).
    project._index = fold(
      [
        project.title,
        project.subtitle,
        project.description,
        ...project.technologies,
        ...project.tags,
        ...cats.flatMap((c) => {
          const meta = categories[c];
          return meta ? [c, meta.label, meta.badge, meta.row, ...(meta.aliases || [])] : [c];
        }),
      ].join(' | ')
    );
    project._words = new Set(project._index.split(/[^a-z0-9.]+/).filter(Boolean));
    out.push(project);
  }
  return out;
}

/**
 * Busca: todos os termos digitados precisam aparecer em algum campo.
 * Termos de até 2 letras ("AR", "VR", "RA") casam apenas palavras inteiras,
 * para que "ar" não encontre "articulações".
 */
export function matchesQuery(project, query) {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  return terms.every((t) => (t.length <= 2 ? project._words.has(t) : project._index.includes(t)));
}

export function matchesFilter(project, filter) {
  if (!filter) return true;
  if (filter.category) return project.categories.includes(filter.category);
  if (filter.technology) return project.technologies.some((t) => fold(t) === fold(filter.technology));
  return true;
}

/**
 * Linhas do catálogo geradas a partir dos dados:
 * Destaques → uma linha por categoria com projetos (ordem da taxonomia,
 * depois categorias desconhecidas) → Todas as experiências.
 */
export function buildRows(projects, categories) {
  const rows = [];
  const featured = projects.filter((p) => p.featured);
  if (featured.length) rows.push({ id: 'destaques', title: 'Destaques', projects: featured });

  const known = Object.keys(categories);
  const extra = [...new Set(projects.flatMap((p) => p.categories))].filter((c) => !known.includes(c));
  for (const key of [...known, ...extra]) {
    const items = projects.filter((p) => p.categories.includes(key));
    if (!items.length) continue;
    rows.push({ id: `cat-${key}`, title: categories[key]?.row || key, projects: items, category: key });
  }
  return rows;
}

export const categoryLabel = (categories, key) => categories[key]?.label || key;
export const categoryBadge = (categories, key) => categories[key]?.badge || key.toUpperCase();
