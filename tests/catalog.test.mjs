import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, categories, filters } from '../src/data/projects.js';
import { normalizeProjects, matchesQuery, matchesFilter, buildRows, safeUrl, fold } from '../src/lib/catalog.js';

const all = normalizeProjects(projects, categories);
const search = (q) => all.filter((p) => matchesQuery(p, q)).map((p) => p.id);

test('todos os 10 projetos são válidos', () => {
  assert.equal(all.length, 10);
  for (const p of all) {
    assert.ok(p.url?.startsWith('https://'), p.id);
    assert.ok(p.image === null || p.image.startsWith('assets/projects/'), p.id);
    assert.ok(p.categories.every((c) => c in categories), `${p.id}: categoria desconhecida`);
  }
});

test('busca por nome, categoria, tecnologia e descrição (sem acento/caixa)', () => {
  assert.deepEqual(search('furadeira'), ['furadeira']);
  assert.deepEqual(search('bomba').sort(), ['bomba-ra', 'mecmonitor']);
  assert.equal(search('Babylon').length, 10);
  assert.deepEqual(search('Digital Twin').sort(), ['atlas', 'furadeira', 'mecmonitor']);
  assert.ok(search('VR').includes('morsa-xr'));
  assert.deepEqual(search('AR').sort(), ['assistente', 'bomba-ra', 'demo-one', 'kit-iot', 'moenda', 'torno-cnc']);
  assert.deepEqual(search('ra').sort(), ['assistente', 'bomba-ra', 'demo-one', 'kit-iot', 'moenda', 'torno-cnc']);
  assert.deepEqual(search('gêmeo digital').sort(), ['atlas', 'furadeira', 'mecmonitor']);
  assert.deepEqual(search('MQTT').sort(), ['atlas', 'furadeira', 'mecmonitor']);
  assert.deepEqual(search('ESP32-C3'), ['kit-iot']);
  assert.deepEqual(search('torno'), ['torno-cnc']);
  assert.deepEqual(search('xyzxyz'), []);
});

test('filtros por categoria e tecnologia', () => {
  const f = (id) => all.filter((p) => matchesFilter(p, filters.find((x) => x.id === id))).map((p) => p.id);
  assert.ok(!f('ar').includes('morsa-xr'));
  assert.ok(f('ar').includes('bomba-ra'));
  assert.deepEqual(f('iot').sort(), ['atlas', 'furadeira', 'kit-iot', 'mecmonitor']);
  assert.equal(f('babylon').length, 10);
});

test('linhas geradas automaticamente', () => {
  const rows = buildRows(all, categories);
  assert.deepEqual(rows.map((r) => r.id), ['destaques', 'cat-digital-twin', 'cat-vr', 'cat-ar', 'cat-webxr', 'cat-iot']);
});

test('dados inválidos não quebram', () => {
  const r = normalizeProjects([null, { id: 'x' }, { id: 'y', title: 'Y', url: 'javascript:alert(1)', image: 'javascript:x', categories: ['nova'] }], categories);
  assert.equal(r.length, 1);
  assert.equal(r[0].url, null);
  assert.equal(r[0].image, null);
  assert.equal(buildRows(r, categories)[0].id, 'cat-nova');
  assert.equal(safeUrl('nota url'), null);
  assert.equal(fold('Câmera'), 'camera');
});
