import { expect, test } from 'bun:test';
import { handle } from '../src/index.js';

test('the home page declares theme colors for light and dark browser chrome', async () => {
  const res = await handle(new Request('https://learn.flisk.si/'), {});
  const body = await res.text();
  expect(body).toContain('<meta name="theme-color" content="#F7F6F2">');
  expect(body).toContain('<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">');
});
