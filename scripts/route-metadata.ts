import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { PAGE_METADATA, SITE_ORIGIN } from '../src/data/site.ts';

const template = await readFile('dist/index.html', 'utf8');
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const [route, metadata] of Object.entries(PAGE_METADATA)) {
  const title = escape(metadata.title);
  const description = escape(metadata.description);
  const url = `${SITE_ORIGIN}${route}`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(")/g, `$1${description}$2`)
    .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(")/g, `$1${title}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  assert.ok(html.includes(`<title>${title}</title>`));
  assert.ok(html.includes(`href="${url}"`));
  const directory = route === '/' ? 'dist' : `dist${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
console.log('Static route metadata generated and checked.');
