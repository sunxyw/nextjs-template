import percySnapshot from '@percy/playwright';
import { expect, test } from '@playwright/test';

import { waitForApiRequest } from './utils';

test.describe('Navigation', () => {
  test.describe('Static pages', () => {
    test('should take screenshot of the home page', async ({ page }) => {
      await page.goto('/');

      await waitForApiRequest(page);

      await expect(
        page.getByRole('heading', {
          name: 'SXYA Community Worldwide',
        }),
      ).toBeVisible();

      await percySnapshot(page, 'Home');
    });

    test('should take screenshot of the member list page', async ({ page }) => {
      await page.goto('/members');

      await expect(
        page.getByRole('heading', {
          name: 'Our Members',
        }),
      ).toBeVisible();

      await percySnapshot(page, 'Member List');
    });

    test('should take screenshot of the dictionary page', async ({ page }) => {
      await page.goto('/dictionary');

      await waitForApiRequest(page);

      await expect(
        page.getByRole('heading', {
          name: 'Dictionary',
        }),
      ).toBeVisible();

      await percySnapshot(page, 'Dictionary');
    });

    test('should take screenshot of the event list page', async ({ page }) => {
      await page.goto('/events');

      await expect(
        page.getByRole('heading', {
          name: 'Check out the latest events and have fun together',
        }),
      ).toBeVisible();

      await percySnapshot(page, 'Event List');
    });

    test('should take screenshot of the game list page', async ({ page }) => {
      await page.goto('/games');

      await waitForApiRequest(page);

      await expect(
        page.getByRole('heading', {
          name: 'Games',
        }),
      ).toBeVisible();

      await percySnapshot(page, 'Game List');
    });
  });
});
