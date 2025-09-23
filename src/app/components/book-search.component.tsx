'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input, Card, CardBody, Image, Skeleton, Button } from '@heroui/react';
import { openLibraryService, type Book } from '../services/openlibrary.service';
import { useRouter } from 'next/navigation';
import { SearchIcon } from './icons';

const BookSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search-books', debouncedQuery],
    queryFn: () => openLibraryService.searchBooks(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const handleBookClick = (book: Book) => {
    const slug = `${openLibraryService.createSlugFromKey(book.key)}-${openLibraryService.createSlugFromTitle(book.title)}`;
    router.push(`/book/${slug}`);
  };

  return (
    <div className="w-full space-y-6">
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Input
            placeholder="Search books by title... (try 'Harry Potter' or 'JavaScript')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<SearchIcon className="text-gray-400" />}
            variant="bordered"
            size="lg"
            className="shadow-sm"
          />
          {debouncedQuery.length > 0 && (
            <div className="absolute -bottom-6 left-0 text-sm text-gray-500">
              🔍 Searching for "{debouncedQuery}"...
            </div>
          )}
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardBody>
            <p className="text-red-600 text-center">Failed to search books. Please try again.</p>
          </CardBody>
        </Card>
      )}

      {debouncedQuery.length > 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Search Results for "{debouncedQuery}"
            </h3>
            {searchResults && (
              <p className="text-gray-600 mt-2">
                Found {searchResults.length} books
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="h-64">
                  <CardBody className="space-y-2">
                    <Skeleton className="w-full h-32 rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((book) => (
                <Card 
                  key={book.key}
                  className="h-64 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50"
                  isPressable
                  onPress={() => handleBookClick(book)}
                >
                  <CardBody className="space-y-2">
                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                      {book.cover_i ? (
                        <Image
                          src={openLibraryService.getCoverImageUrl(book.cover_i, 'M')}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          fallbackSrc="/placeholder-book.svg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl mb-1">📖</div>
                            <span className="text-gray-500 text-xs">No Cover</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {book.title}
                      </h4>
                      {book.author_name && book.author_name.length > 0 && (
                        <p className="text-xs text-gray-600 line-clamp-1">
                          by {book.author_name[0]}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No books found for "{debouncedQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
