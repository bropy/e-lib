import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';


export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 2 * 60 * 1000, 
    },
  },
};

export const getQueryClient = cache(() => new QueryClient(queryClientConfig));
