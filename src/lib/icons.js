/** Ícones minimalistas (traço 1.75px, 24×24). SVG estático e decorativo. */
const svg = (body, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  search: (s) => svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>', s),
  menu: (s) => svg('<path d="M4 7h16M4 12h16M4 17h16"/>', s),
  close: (s) => svg('<path d="M6 6l12 12M18 6 6 18"/>', s),
  external: (s) => svg('<path d="M14 5h5v5"/><path d="M19 5l-8.5 8.5"/><path d="M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/>', s),
  chevronLeft: (s) => svg('<path d="m15 18-6-6 6-6"/>', s),
  chevronRight: (s) => svg('<path d="m9 18 6-6-6-6"/>', s),
  chevronDown: (s) => svg('<path d="m6 9 6 6 6-6"/>', s),
  arrowDown: (s) => svg('<path d="M12 5v14M6 13l6 6 6-6"/>', s),
  check: (s) => svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', s),
  layers: (s) => svg('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>', s),
  cube: (s) => svg('<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>', s),
  headset: (s) => svg('<path d="M3 9.5A2.5 2.5 0 0 1 5.5 7h13A2.5 2.5 0 0 1 21 9.5v5a2.5 2.5 0 0 1-2.5 2.5h-3l-2-2.5h-3l-2 2.5h-3A2.5 2.5 0 0 1 3 14.5v-5Z"/>', s),
  signal: (s) => svg('<path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>', s),
  twin: (s) => svg('<rect x="3" y="5" width="8" height="14" rx="1.5"/><rect x="13" y="5" width="8" height="14" rx="1.5" stroke-dasharray="2.5 2"/><path d="M11 12h2"/>', s),
  alert: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/>', s),
};

/** Marca XR LAB: dois chevrons formando um "X" dentro de um quadro chanfrado. */
export const logoMark = (size = 28) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M7 2h18l5 5v18l-5 5H7l-5-5V7z" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/><path d="M10 10l5 6-5 6M22 10l-5 6 5 6" fill="none" stroke="var(--c-accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
