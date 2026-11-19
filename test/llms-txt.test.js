import { expect, test } from 'bun:test';
import { handle } from '../src/index.js';

const ORIGIN = 'https://learn.flisk.si';
const get = (path) => handle(new Request(`${ORIGIN}${path}`), { PUBLIC_ORIGIN: ORIGIN });

test('GET /llms.txt returns plain text that names the site on the first line', async () => {
  const res = await get('/llms.txt');
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toMatch(/^text\/plain/);
  expect((await res.text()).split('\n')[0]).toMatch(/^# Flisk Learn\b/);
});

test('every public link in llms.txt resolves to a 200 page', async () => {
  const text = await (await get('/llms.txt')).text();
  const paths = [...text.matchAll(/\]\(https:\/\/learn\.flisk\.si(\/[^)#]*)\)/g)].map((m) => m[1] || '/');
  expect(paths.length).toBeGreaterThan(0);
  for (const path of new Set(paths)) {
    const res = await get(path);
    expect(res.status, path).toBe(200);
  }
});

test('robots.txt allows /llms.txt', async () => {
  const robots = await (await get('/robots.txt')).text();
  expect(robots).toMatch(/^Allow: \/llms\.txt$/m);
});
