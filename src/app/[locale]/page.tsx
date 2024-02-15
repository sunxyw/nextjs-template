import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';

// @ts-ignore
export default function HomePage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  return (
    <>
    </>
  );
}

export async function generateMetadata({
  params: { locale },
}: WithLocaleParam) {
  const t = await getTranslations({ locale, namespace: 'Home.metadata' });
  const ct = await getTranslations({ locale, namespace: 'Common' });

  return {
    // NOTE: title.template defined in layout will not apply to a title defined in a page of the same route segment,
    // so we define absolute title here.
    title: {
      absolute: `${t('title')} | ${ct('brand_full')}`,
    },
    description: t('description'),
  };
}
