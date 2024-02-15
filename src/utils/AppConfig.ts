import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/shared/types';

const localePrefix: LocalePrefix = 'as-needed';

export const AppConfig = {
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix,
  assetCdn: 'https://sxya-vegas.imgix.net',
};
