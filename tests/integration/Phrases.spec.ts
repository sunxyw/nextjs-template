import { expect, test } from '@playwright/test';

// Don't use the default user agent to avoid the requests to be blocked by Clerk middleware.
test.use({ userAgent: '' });

test.describe('Phrases', () => {
  test.describe('Listing', () => {
    test('should return a list of phrases', async ({ request }) => {
      const response = await request.get('/api/phrases');
      expect(response.status()).toBe(200);

      const responseJson = await response.json();
      expect(responseJson).toBeInstanceOf(Array);
      expect(responseJson.length).toBeGreaterThan(0);
      expect(responseJson[0]).toHaveProperty('id');
    });

    test('should raise an error if parameters are invalid', async ({
      request,
    }) => {
      const response = await request.get('/api/phrases?page=0');
      expect(response.status()).toBe(422);
    });

    test('should return a random list of phrases if random is set to true', async ({
      request,
    }) => {
      const firstResponse = await request.get(
        '/api/phrases?perPage=4&random=true',
      );
      expect(firstResponse.status()).toBe(200);
      const firstResponseJson = await firstResponse.json();

      const secondResponse = await request.get(
        '/api/phrases?perPage=4&random=true',
      );
      expect(secondResponse.status()).toBe(200);
      const secondResponseJson = await secondResponse.json();

      expect(firstResponseJson).not.toEqual(secondResponseJson);
    });
  });
});
