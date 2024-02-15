import { enUS } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import type { PropsWithChildren } from 'react';
import React from 'react';

export default function ServerProviders({
  children,
  params: { locale },
}: PropsWithChildren<{ params: { locale: string } }>): React.ReactNode {
  const clerkLocaleMap: Record<string, typeof enUS> = {
    'en-US': enUS,
  };

  return (
    <ClerkProvider localization={clerkLocaleMap[locale] || enUS}>
      {children}
    </ClerkProvider>
  );
}
