import { expect, test } from '@playwright/test';

const LAB = '10-local-model';

test.describe('header', () => {
  for (const [path, heading] of [['/learn', 'What do you want to learn?'], ['/practice', 'What do you want to practice?'], ['/exam', 'Ready to prove it?']]) {
    test(`${path} opens signed out`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('Learn, Practice and Exam links move between the modes', async ({ page }) => {
    await page.goto('/learn');
    for (const [name, heading] of [['Practice', 'What do you want to practice?'], ['Exam', 'Ready to prove it?'], ['Learn', 'What do you want to learn?']]) {
      await page.getByRole('link', { name, exact: true }).first().click();
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    }
  });
});

test.describe('practice', () => {
  test('the lab list links to a lab page', async ({ page }) => {
    await page.goto('/practice');
    await page.locator(`a[href$="/practice/${LAB}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/practice/${LAB}$`));
    await expect(page.getByRole('heading', { level: 1, name: 'Run a model on your laptop' })).toBeVisible();
  });

  test('a lab page shows every step with its check, and no script errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/practice/${LAB}`);
    for (const n of [1, 2, 3]) await expect(page.getByRole('button', { name: `Check step ${n}` })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('checking a step signed out asks for GitHub sign-in, and nothing else', async ({ page }) => {
    await page.goto(`/practice/${LAB}`);
    await page.getByRole('button', { name: 'Check step 1' }).click();
    await expect(page.getByText(/sign in/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in with GitHub' }).first()).toHaveAttribute('href', '/auth/login');
  });
});

test('/auth/login sends the learner to GitHub', async ({ request }) => {
  const res = await request.get('/auth/login', { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers().location).toMatch(/^https:\/\/github\.com\/login\/oauth\/authorize\?/);
});
