import { h } from '../lib/dom.js';
import { icons } from '../lib/icons.js';
import { categoryLabel } from '../lib/catalog.js';
import { ProjectImage, Badges } from './ProjectCard.js';

const CLOSE_MS = 180;

/**
 * Detalhes da experiência em <dialog> nativo: foco preso no modal, ESC,
 * fundo inerte. Desktop = modal central; mobile = bottom sheet (CSS).
 */
export function ProjectModal({ categories, reducedMotion, onRequestClose }) {
  const content = h('div', { class: 'modal__content' });
  const closeBtn = h('button', {
    type: 'button',
    class: 'icon-btn modal__close',
    'aria-label': 'Fechar detalhes',
    html: icons.close(22),
  });

  const dialog = h(
    'dialog',
    { class: 'modal', 'aria-labelledby': 'modal-title', 'aria-describedby': 'modal-desc' },
    h('div', { class: 'modal__panel' }, closeBtn, content)
  );

  let opener = null;

  closeBtn.addEventListener('click', () => onRequestClose());

  // ESC: tratamos nós mesmos para manter o histórico (Back) consistente.
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    onRequestClose();
  });

  // Clique no fundo (fora do painel) fecha.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) onRequestClose();
  });

  const section = (title, items, cls = '') =>
    items.length
      ? h(
          'div',
          { class: `modal__section ${cls}` },
          h('h3', { class: 'modal__label' }, title),
          h('ul', { class: 'modal__tags', role: 'list' }, items.map((t) => h('li', { class: 'tag' }, t)))
        )
      : null;

  function build(project) {
    const host = project.url ? new URL(project.url).host : null;

    const primary = project.url
      ? h(
          'a',
          {
            class: 'btn btn--primary modal__open',
            href: project.url,
            target: '_blank',
            rel: 'noopener',
            'aria-label': `Abrir experiência ${project.title} (abre em nova aba)`,
          },
          h('span', { html: icons.external(18) }),
          'Abrir experiência'
        )
      : h(
          'button',
          { type: 'button', class: 'btn btn--primary modal__open', 'aria-disabled': 'true', 'aria-describedby': 'modal-url-error' },
          h('span', { html: icons.external(18) }),
          'Abrir experiência'
        );

    const detailsId = `modal-details-${project.id}`;
    const toggle = h(
      'button',
      { type: 'button', class: 'btn btn--secondary', 'aria-expanded': 'false', 'aria-controls': detailsId },
      h('span', { class: 'toggle-label' }, 'Detalhes'),
      h('span', { class: 'toggle-icon', html: icons.chevronDown(18) })
    );

    const details = h(
      'div',
      { class: 'modal__details', id: detailsId, hidden: true },
      project.features.length
        ? h(
            'div',
            { class: 'modal__section' },
            h('h3', { class: 'modal__label' }, 'Recursos'),
            h('ul', { class: 'modal__features', role: 'list' }, project.features.map((f) => h('li', {}, h('span', { html: icons.check(16) }), f)))
          )
        : null,
      section('Compatibilidade', project.compatibility),
      host
        ? h(
            'div',
            { class: 'modal__section' },
            h('h3', { class: 'modal__label' }, 'Endereço'),
            h('p', { class: 'modal__host mono' }, host)
          )
        : null
    );

    toggle.addEventListener('click', () => {
      const open = details.hidden;
      details.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.toggle-label').textContent = open ? 'Ocultar detalhes' : 'Detalhes';
      if (open) details.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
    });

    content.replaceChildren(
      h('div', { class: 'modal__media' }, ProjectImage(project, { eager: true, sizes: '(min-width: 800px) 760px, 100vw', alt: `Cena 3D da experiência ${project.title}` }), Badges(project, categories, 'modal__badges')),
      h(
        'div',
        { class: 'modal__body' },
        project.subtitle ? h('p', { class: 'eyebrow' }, project.subtitle) : null,
        h('h2', { class: 'modal__title', id: 'modal-title' }, project.title),
        h('p', { class: 'modal__desc', id: 'modal-desc' }, project.description || 'Descrição em breve.'),
        h(
          'div',
          { class: 'modal__meta' },
          section('Categorias', project.categories.map((c) => categoryLabel(categories, c))),
          section('Tecnologias', project.technologies)
        ),
        h('div', { class: 'modal__actions' }, primary, toggle),
        project.url
          ? h('p', { class: 'modal__note' }, 'Abre em nova aba, no endereço original da aplicação. Recursos de VR/AR dependem do dispositivo.')
          : h('p', { class: 'modal__error', id: 'modal-url-error', role: 'alert' }, h('span', { html: icons.alert(16) }), 'Link indisponível no momento. Tente novamente mais tarde.'),
        details
      )
    );
  }

  return {
    el: dialog,
    get isOpen() {
      return dialog.open;
    },
    open(project, from) {
      opener = from || document.activeElement;
      build(project);
      dialog.classList.remove('is-closing');
      if (!dialog.open) {
        dialog.showModal();
        document.documentElement.classList.add('has-modal');
      }
      content.scrollTop = 0;
      dialog.querySelector('.modal__panel').scrollTop = 0;
      closeBtn.focus({ preventScroll: true });
    },
    close() {
      if (!dialog.open) return;
      const finish = () => {
        dialog.classList.remove('is-closing');
        dialog.close();
        document.documentElement.classList.remove('has-modal');
        if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
        opener = null;
      };
      if (reducedMotion()) return finish();
      dialog.classList.add('is-closing');
      setTimeout(finish, CLOSE_MS);
    },
  };
}
