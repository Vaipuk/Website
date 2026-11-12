import assert from 'node:assert/strict';
import test from 'node:test';
import { PROJECTS, getProjectFromSearch } from '../src/data/projects.ts';

test('a shared project link opens the matching detail', () => {
  assert.equal(getProjectFromSearch('?project=tensor-aurora')?.title, 'Tensor Aurora');
  assert.equal(getProjectFromSearch('?project=neural-canvas')?.title, 'Neural Canvas');
  assert.equal(getProjectFromSearch('?project=data-forge')?.title, 'Data Forge');
  assert.equal(getProjectFromSearch('?project=quantum-sim')?.title, 'Quantum Sim');
});

test('missing and unknown project links leave the index available', () => {
  assert.equal(getProjectFromSearch(''), undefined);
  assert.equal(getProjectFromSearch('?project='), undefined);
  assert.equal(getProjectFromSearch('?project=not-a-project'), undefined);
});

test('every index project has a unique working detail destination', () => {
  assert.equal(new Set(PROJECTS.map(project => project.id)).size, PROJECTS.length);
  for (const project of PROJECTS) {
    assert.equal(getProjectFromSearch(`?project=${encodeURIComponent(project.id)}`), project);
    assert.ok(project.description);
    assert.ok(project.details);
  }
});
