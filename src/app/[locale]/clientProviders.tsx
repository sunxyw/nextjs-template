'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';

export default function ClientProviders({
  children,
}: PropsWithChildren<{}>): React.ReactNode {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
