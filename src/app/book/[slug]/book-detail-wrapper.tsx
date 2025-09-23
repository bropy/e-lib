'use client';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { openLibraryService, type Book } from '../../services/openlibrary.service';
import BookDetailClient from './book-detail-client';

interface BookDetailWrapperProps {
  bookKey: string;
  initialBook: Book;
}

const BookDetailWrapper = ({ bookKey, initialBook }: BookDetailWrapperProps) => {
  // Create a query client and prefill it with the server-fetched data
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 2 * 60 * 60 * 1000, // 2 hours
      },
    },
  });

  // Set the initial data in the query cache
  queryClient.setQueryData(['book-detail', bookKey], initialBook);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookDetailClient bookKey={bookKey} />
    </HydrationBoundary>
  );
};

export default BookDetailWrapper;
