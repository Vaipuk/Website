import assert from 'node:assert/strict';
import test from 'node:test';
import { createSpotifyHandler } from '../server/spotify.ts';

const env = {
  SPOTIFY_CLIENT_ID: 'test-client',
  SPOTIFY_CLIENT_SECRET: 'private-client-secret',
  SPOTIFY_REFRESH_TOKEN: 'private-refresh-token',
};

const track = {
  id: 'track-1', name: 'Real song', artists: [{ name: 'Real artist' }],
  album: { name: 'Real album', images: [{ url: 'https://i.scdn.co/image/cover' }] },
  duration_ms: 180000, private_field: 'should-not-be-public',
};

function upstream(options: { idle?: boolean; fail?: boolean; malformed?: boolean } = {}) {
  const requests: string[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input);
    requests.push(url);
    assert.ok(init?.signal, 'upstream requests must have a deadline');
    if (options.fail) throw new Error(`failure containing ${env.SPOTIFY_CLIENT_SECRET}`);
    if (url.includes('/api/token')) {
      assert.equal(new URLSearchParams(String(init?.body)).get('refresh_token'), env.SPOTIFY_REFRESH_TOKEN);
      return Response.json({ access_token: 'private-access-token', expires_in: 3600 });
    }
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer private-access-token');
    if (url.includes('/currently-playing')) {
      return options.idle
        ? new Response(null, { status: 204 })
        : Response.json({ item: track, is_playing: true, progress_ms: 12000 });
    }
    if (url.includes('/recently-played')) {
      return Response.json({ items: options.idle ? [] : [{ track }] });
    }
    assert.ok(url.includes('/top/tracks?time_range=short_term&limit=4'));
    return Response.json(options.malformed ? {} : { items: options.idle ? [] : [track] });
  };
  return { fetcher, requests };
}

test('missing server credentials return an honest unavailable response without contacting Spotify', async () => {
  const { fetcher, requests } = upstream();
  const response = await createSpotifyHandler({}, fetcher)();
  assert.equal(response.status, 503);
  assert.match(response.headers.get('cache-control')!, /no-store/);
  assert.deepEqual(await response.json(), {
    nowPlaying: null, recentTracks: [], topTracks: [], error: 'Spotify is unavailable right now.',
  });
  assert.equal(requests.length, 0);
});

test('successful responses allow only public display fields, never credentials or raw provider data', async () => {
  const { fetcher } = upstream();
  const response = await createSpotifyHandler(env, fetcher)();
  assert.equal(response.status, 200);
  const body = await response.text();
  for (const secret of [...Object.values(env), 'private-access-token', 'should-not-be-public']) {
    assert.ok(!body.includes(secret));
  }
  const data = JSON.parse(body);
  assert.deepEqual(data.nowPlaying, {
    id: 'track-1', name: 'Real song', artist: 'Real artist', album: 'Real album',
    albumArtUrl: 'https://i.scdn.co/image/cover', durationMs: 180000,
    progressMs: 12000, isPlaying: true,
  });
  assert.equal(data.recentTracks[0].name, 'Real song');
  assert.equal(data.topTracks[0].name, 'Real song');
  assert.equal(data.error, null);
});

test('legitimate idle playback and empty history return success with no invented music', async () => {
  const { fetcher } = upstream({ idle: true });
  const response = await createSpotifyHandler(env, fetcher)();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { nowPlaying: null, recentTracks: [], topTracks: [], error: null });
});

test('API errors are sanitized and briefly cached before a new attempt', async () => {
  let time = 1000;
  const { fetcher, requests } = upstream({ fail: true });
  const handle = createSpotifyHandler(env, fetcher, () => time);
  const first = await handle();
  assert.equal(first.status, 503);
  assert.ok(!(await first.text()).includes(env.SPOTIFY_CLIENT_SECRET));
  await handle();
  assert.equal(requests.length, 1);
  time += 16000;
  await handle();
  assert.equal(requests.length, 2);
});

test('malformed provider responses fail safely rather than claiming an empty listening history', async () => {
  const { fetcher } = upstream({ malformed: true });
  const response = await createSpotifyHandler(env, fetcher)();
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.nowPlaying.name, 'Real song');
  assert.deepEqual(data.topTracks, []);
  assert.equal(typeof data.error, 'string');
});

test('simultaneous visitors share one request and fresh display data reuse the token', async () => {
  let time = 1000;
  const { fetcher, requests } = upstream();
  const handle = createSpotifyHandler(env, fetcher, () => time);
  const responses = await Promise.all([handle(), handle(), handle()]);
  assert.ok(responses.every(response => response.status === 200));
  assert.equal(requests.length, 4);
  await handle();
  assert.equal(requests.length, 4);
  time += 31000;
  await handle();
  assert.equal(requests.length, 6); // top tracks are reused for an hour
  assert.equal(requests.filter(url => url.includes('/api/token')).length, 1);
});

test('a rate-limited endpoint does not blank the others, and the last good list is kept', async () => {
  let time = 1000;
  let limited = true;
  const { fetcher, requests } = upstream();
  const limiting: typeof fetch = async (input, init) => {
    const url = String(input);
    if (!limited || url.includes('/api/token') || url.includes('/currently-playing')) return fetcher(input, init);
    requests.push(url);
    return new Response('private upstream error', { status: 429, headers: { 'retry-after': '60' } });
  };
  const handle = createSpotifyHandler(env, limiting, () => time);

  const cold = await handle();
  assert.equal(cold.status, 200);
  const partial = await cold.json();
  assert.equal(partial.nowPlaying.name, 'Real song');
  assert.deepEqual(partial.topTracks, []);
  assert.equal(typeof partial.error, 'string'); // missing lists are reported, not shown as empty history
  time += 31000;
  await handle();
  assert.equal(requests.length, 4); // retry-after is honored

  limited = false;
  time += 31000;
  const healthy = await (await handle()).json();
  assert.equal(healthy.topTracks.length, 1);
  assert.equal(healthy.error, null);

  limited = true;
  time += 31000;
  const stale = await (await handle()).json();
  assert.equal(stale.recentTracks[0].name, 'Real song');
  assert.equal(stale.topTracks.length, 1);
  assert.equal(stale.error, null);
});

test('HTTP rate limits fail safely and honor the upstream retry window', async () => {
  let time = 1000;
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    return new Response('private upstream error', { status: 429, headers: { 'retry-after': '60' } });
  };
  const handle = createSpotifyHandler(env, fetcher, () => time);
  const response = await handle();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('x-spotify-failure'), '/api/token 429');
  assert.ok(!(await response.text()).includes('private upstream error'));
  time += 31000;
  await handle();
  assert.equal(calls, 1);
  time += 31000;
  await handle();
  assert.equal(calls, 2);
});
