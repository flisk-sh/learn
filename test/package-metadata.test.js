import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const license = readFileSync(new URL('LICENSE', root), 'utf8');

test('package metadata declares the MIT license shipped in LICENSE', () => {
  expect(pkg.license).toBe('MIT');
  expect(license).toMatch(/^MIT License\b/m);
});
