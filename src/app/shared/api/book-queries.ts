import { queryOptions } from '@tanstack/react-query';
import { openLibraryService } from '../services/openlibrary.service';

export const bookDetailQueryOptions = (bookKey: string) =>
  queryOptions({
    queryKey: ['book-detail', bookKey],
    queryFn: () => openLibraryService.getBookByKey(bookKey),
    staleTime: 30 * 1000, 
  });

export const popularBooksQueryOptions = () =>
  queryOptions({
    queryKey: ['popular-books'],
    queryFn: () => openLibraryService.getPopularBooks(),
    staleTime: 30 * 1000,
  });

export const searchBooksQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ['search-books', query],
    queryFn: () => openLibraryService.searchBooks(query),
    staleTime: 30 * 1000,
    enabled: query.length > 2,
  });
