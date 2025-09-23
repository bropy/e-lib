'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUIProvider } from '@heroui/react';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000, // 30 seconds
          gcTime: 2 * 60 * 1000, // 2 minutes
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
