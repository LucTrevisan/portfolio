import { App } from './App.js';

const root = document.getElementById('app');

try {
  App(root);
} catch (err) {
  // Recuperação de erro: mensagem clara em vez de página em branco.
  console.error('[XR LAB]', err);
  root.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'fatal';
  box.setAttribute('role', 'alert');
  box.innerHTML =
    '<h1>Não foi possível carregar o catálogo.</h1><p>Recarregue a página. Se o problema continuar, tente novamente mais tarde.</p>';
  const btn = document.createElement('button');
  btn.className = 'btn btn--primary';
  btn.textContent = 'Recarregar';
  btn.addEventListener('click', () => location.reload());
  box.append(btn);
  root.append(box);
}

// PWA: o manifest (manifest.webmanifest) já habilita "Adicionar à tela
// inicial". Não há service worker de propósito: cache offline poderia
// interferir nas aplicações WebXR externas. Ao criar um no futuro, limite-o
// à origem do catálogo.
