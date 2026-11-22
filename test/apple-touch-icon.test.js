import { expect, test } from 'bun:test';
import { handle } from '../src/index.js';

test('the home page declares the Flisk touch icon', async () => {
  const res = await handle(new Request('https://learn.flisk.si/'), {});
  const body = await res.text();
  expect(body).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
});

test('the touch icon is a cached 180x180 PNG', async () => {
  const res = await handle(new Request('https://learn.flisk.si/apple-touch-icon.png'), {});
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toContain('image/png');
  expect(res.headers.get('cache-control')).toContain('max-age=31536000');

  const bytes = new Uint8Array(await res.arrayBuffer());
  expect(Array.from(bytes.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  expect(view.getUint32(16)).toBe(180);
  expect(view.getUint32(20)).toBe(180);
});
