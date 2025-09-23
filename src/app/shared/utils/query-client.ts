import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,// 30 seconds
      gcTime: 2 * 60 * 1000,// 2 minutes
    },
  },
}));
