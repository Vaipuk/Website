import { createSpotifyHandler, type SpotifyEnv } from '../../server/spotify.ts';

let handle: ReturnType<typeof createSpotifyHandler> | undefined;

export function onRequestGet({ env }: { env: SpotifyEnv }): Promise<Response> {
  handle ??= createSpotifyHandler(env);
  return handle();
}
