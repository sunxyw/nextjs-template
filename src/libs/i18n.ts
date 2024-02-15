import { getRequestConfig } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';

// Using internationalization in Server Components
export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = AppConfig.locales.includes(locale)
    ? locale
    : AppConfig.defaultLocale;

  return {
    messages: (await import(`../locales/${resolvedLocale}.json`)).default,
  };
});
