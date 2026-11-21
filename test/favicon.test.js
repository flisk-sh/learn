import { expect, test } from 'bun:test';
import { handle } from '../src/index.js';
import { ICON_SVG } from '../src/page.js';

const get = (path, method = 'GET') => handle(new Request(`https://learn.flisk.si${path}`, { method }), {});

test('GET /favicon.ico returns the site icon as an image', async () => {
  const res = await get('/favicon.ico');
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toMatch(/^image\/svg\+xml/);
  expect(await res.text()).toBe(ICON_SVG);
});

test('HEAD /favicon.ico works and the response is cacheable for at least a day', async () => {
  const head = await get('/favicon.ico', 'HEAD');
  expect(head.status).toBe(200);
  const maxAge = Number(head.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]);
  expect(maxAge).toBeGreaterThanOrEqual(86400);
});

test('the inline icon link and the route share one SVG', async () => {
  const home = await (await get('/')).text();
  const inline = home.match(/<link rel="icon" href="data:image\/svg\+xml,([^"]+)">/)?.[1];
  expect(inline).toBeTruthy();
  expect(decodeURIComponent(inline)).toBe(ICON_SVG);
});
