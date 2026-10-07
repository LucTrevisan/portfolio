import { h, debounce } from '../lib/dom.js';
import { icons } from '../lib/icons.js';

/**
 * Campo de busca instantânea.
 * Um único <input> serve desktop (inline no header) e mobile (painel).
 */
export function Search({ onInput, onSubmit }) {
  const emit = debounce((v) => onInput(v), 120);

  const input = h('input', {
    id: 'search-input',
    class: 'search__input',
    type: 'search',
    name: 'q',
    placeholder: 'Buscar experiências...',
    autocomplete: 'off',
    spellcheck: 'false',
    enterkeyhint: 'search',
    'aria-describedby': 'search-hint',
  });

  const clear = h('button', {
    type: 'button',
    class: 'search__clear icon-btn',
    'aria-label': 'Limpar busca',
    hidden: true,
    html: icons.close(18),
  });

  const form = h(
    'form',
    { class: 'search', role: 'search', 'aria-label': 'Buscar experiências' },
    h('label', { class: 'sr-only', for: 'search-input' }, 'Buscar experiências'),
    h('span', { class: 'search__icon', html: icons.search(18) }),
    input,
    clear,
    h('span', { id: 'search-hint', class: 'sr-only' }, 'Busca por nome, categoria, tecnologia ou descrição. Os resultados aparecem enquanto você digita.')
  );

  const sync = () => {
    clear.hidden = input.value.length === 0;
  };

  input.addEventListener('input', () => {
    sync();
    emit(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) {
      e.stopPropagation();
      input.value = '';
      sync();
      onInput('');
    }
  });

  clear.addEventListener('click', () => {
    input.value = '';
    sync();
    onInput('');
    input.focus();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onInput(input.value);
    onSubmit?.(input.value);
  });

  return {
    el: form,
    input,
    setValue(v) {
      if (input.value !== v) input.value = v;
      sync();
    },
    focus() {
      input.focus({ preventScroll: true });
    },
  };
}
