import '@/styles/global.css';

import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from 'next-intl/server';
import React, { Suspense } from 'react';

import Loading from '@/app/[locale]/loading';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { AppConfig } from '@/utils/AppConfig';

import ClientProviders from './clientProviders';
import ServerProviders from './serverProviders';

const RootLayout = async ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  if (!AppConfig.locales.includes(params.locale)) {
    notFound();
  }

  unstable_setRequestLocale(params.locale);

  const messages = await getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ServerProviders params={params}>
          <ClientProviders>
            <NextIntlClientProvider locale={params.locale} messages={messages}>
              <Header />
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Footer />

              <Toaster />
            </NextIntlClientProvider>
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  );
};

export default RootLayout;

export async function generateStaticParams() {
  return AppConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: WithLocaleParam) {
  const t = await getTranslations({ locale, namespace: 'Common' });

  return {
    title: {
      template: `%s | ${t('brand_full')}`,
      default: t('brand_full'),
    },
  };
}
