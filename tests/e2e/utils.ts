import type { Page } from 'playwright-core';

export const waitForApiRequest = async (page: Page) => {
  await page.waitForResponse(
    (response) => response.url().includes('/api') && response.status() === 200,
  );
};
