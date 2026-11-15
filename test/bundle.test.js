import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';

// page.js sends client() to the browser as text. With keep_names on, wrangler's bundler puts
// __name() calls in it and the whole page script throws "__name is not defined".
test('wrangler does not keep function names', () => {
  expect(readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8')).toMatch(/^keep_names = false$/m);
});
