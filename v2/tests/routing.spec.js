// @ts-check
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe('Routing — Direct URL navigation', () => {
  test('/ loads home page', async ({ page }) => {
    await page.goto(BASE + '/');
    await expect(page.locator('text=No more excuses')).toBeVisible();
  });

  test('/programs loads program list', async ({ page }) => {
    await page.goto(BASE + '/programs');
    await expect(page.locator('h1:has-text("Programs")')).toBeVisible();
  });

  test('/exercises loads exercise library', async ({ page }) => {
    await page.goto(BASE + '/exercises');
    await expect(page.locator('h1:has-text("Exercises")')).toBeVisible();
  });

  test('/exercise/dbboxsquats loads exercise detail', async ({ page }) => {
    await page.goto(BASE + '/exercise/dbboxsquats');
    await expect(page.locator('text=DB Box Squat')).toBeVisible({ timeout: 10000 });
  });

  test('/program/agility_lower_1-1 loads program detail', async ({ page }) => {
    await page.goto(BASE + '/program/agility_lower_1-1');
    await expect(page.locator('h1:has-text("Agility Lower Body Program 1.1")')).toBeVisible({ timeout: 10000 });
  });

  test('/search loads search page', async ({ page }) => {
    await page.goto(BASE + '/search');
    await expect(page.locator('h1:has-text("Search")')).toBeVisible();
  });

  test('/nonexistent shows 404 page', async ({ page }) => {
    await page.goto(BASE + '/nonexistent');
    await expect(page.locator('text=Page not found')).toBeVisible();
  });
});

test.describe('Routing — In-app navigation (click)', () => {
  test('home → programs → back', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.click('[data-action="programs"]');
    await expect(page.locator('h1:has-text("Programs")')).toBeVisible();
    expect(page.url()).toBe(BASE + '/programs');

    // Browser back
    await page.goBack();
    await expect(page.locator('text=No more excuses')).toBeVisible();
    expect(page.url()).toBe(BASE + '/');
  });

  test('home → search → type query → results appear', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.click('[data-action="search"]');
    await expect(page.locator('h1:has-text("Search")')).toBeVisible();
    expect(page.url()).toBe(BASE + '/search');

    await page.fill('[data-input="search"]', 'agility');
    await page.waitForTimeout(200); // debounce
    await expect(page.locator('[data-program-id]').first()).toBeVisible();
  });

  test('legacy hash URL redirects to clean path', async ({ page }) => {
    await page.goto(BASE + '/#/programs');
    await page.waitForTimeout(100);
    await expect(page.locator('h1:has-text("Programs")')).toBeVisible();
    // URL should be clean (no hash)
    expect(page.url()).not.toContain('#');
  });
});
