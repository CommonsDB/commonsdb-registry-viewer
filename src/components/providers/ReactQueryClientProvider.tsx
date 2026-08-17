'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  // Created per component instance (not module scope) so SSR never shares a
  // client — and its cache — across concurrent requests.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            // Client errors (4xx) will not succeed on retry; only retry what
            // might be transient.
            retry: (failureCount, error) =>
              failureCount < 3 && ((error as AxiosError).response?.status ?? 500) >= 500,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
