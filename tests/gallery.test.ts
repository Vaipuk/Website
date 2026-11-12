import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fetchGalleryData, getAllPhotosWithTripName } from '../src/data/gallery.ts';

test('gallery stays usable offline with existing local photographs', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('offline'); };
  try {
    const albums = await fetchGalleryData();
    assert.ok(albums.length > 0, 'offline gallery must have local albums');
    for (const album of albums) {
      for (const url of [album.coverImage, ...album.images.map(image => image.src)]) {
        assert.ok(url.startsWith('/'), 'fallback must not depend on the remote host');
        assert.ok(existsSync(path.join('public', decodeURIComponent(url))));
      }
    }
  } finally { globalThis.fetch = originalFetch; }
});

test('gallery rejects an unsuccessful or malformed manifest and keeps local albums', async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const response of [new Response('{}', { status: 503 }), Response.json({ trips: [] }), Response.json({ trips: [{ folder: '../outside', photos: ['x.jpg'] }] })]) {
      globalThis.fetch = async () => response;
      const albums = await fetchGalleryData();
      assert.ok(albums.length > 0);
      assert.ok(albums.every(album => album.coverImage.startsWith('/')));
    }
  } finally { globalThis.fetch = originalFetch; }
});

test('remote gallery preserves multiword locations and encodes path segments', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ trips: [{ folder: 'New York-2025', photos: ['photo one.JPG'] }] });
  try {
    const albums = await fetchGalleryData();
    assert.equal(albums[0].name, 'New York 2025');
    assert.match(albums[0].images[0].src, /New%20York-2025\/photo%20one.JPG$/);
    assert.equal(getAllPhotosWithTripName(albums)[0].location, 'New York 2025');
  } finally { globalThis.fetch = originalFetch; }
});

test('a successful remote manifest still uses local originals when they are available', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ trips: [{ folder: 'Italy-2024', photos: ['DSC00458.JPG'] }] });
  try {
    const [album] = await fetchGalleryData();
    assert.equal(album.images[0].src, '/trips/Italy-2024/DSC00458.JPG');
    assert.ok(album.images[0].thumbnail?.startsWith('/thumbnails/'));
  } finally { globalThis.fetch = originalFetch; }
});
