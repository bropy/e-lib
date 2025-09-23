'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, Image, Chip, Skeleton, Button } from '@heroui/react';
import { openLibraryService, type Book } from '../services/openlibrary.service';
import { useBookStore } from '../store/book-store';
import { useRouter } from 'next/navigation';
import { HeartIcon } from './icons';

const PopularBooks = () => {
  const { data: books, isLoading, error, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ['popular-books'],
    queryFn: openLibraryService.getPopularBooks,
    staleTime: 30 * 1000, // 30 seconds - data becomes stale after 30s
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active
  });

  const { toggleLike, isLiked } = useBookStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  
  // Get current topic for display
  const getCurrentTopic = () => {
    const searchTopics = [
      'Fiction', 'Science', 'History', 'Fantasy', 'Mystery',
      'Romance', 'Biography', 'Technology', 'Adventure', 'Classic'
    ];
    const topicIndex = Math.floor(Date.now() / 30000) % searchTopics.length;
    return searchTopics[topicIndex];
  };

  // Countdown timer for next refresh
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const secondsInCurrentCycle = Math.floor(now / 1000) % 30;
      const secondsUntilNext = 30 - secondsInCurrentCycle;
      setCountdown(secondsUntilNext);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBookClick = (book: Book) => {
    const slug = `${openLibraryService.createSlugFromKey(book.key)}-${openLibraryService.createSlugFromTitle(book.title)}`;
    router.push(`/book/${slug}`);
  };

  const handleLikeClick = (bookKey: string) => {
    toggleLike(bookKey);
  };

  if (error) {
    return (
      <div className="w-full p-4">
        <Card className="bg-red-50 border-red-200">
          <CardBody>
            <p className="text-red-600">Failed to load popular books. Please try again later.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-bold text-gray-900">Popular Books</h2>
          {isFetching && (
            <Chip size="sm" color="warning" variant="flat" className="animate-pulse">
              🔄 Refreshing...
            </Chip>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600">
            Currently showing: <span className="font-semibold text-blue-600">{getCurrentTopic()}</span> books
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm text-gray-500">
              📱 Auto-refreshes every 30 seconds with new topics
            </p>
            <Chip 
              size="sm" 
              color={countdown <= 5 ? "danger" : "secondary"} 
              variant="flat"
              className={countdown <= 5 ? "animate-pulse" : ""}
            >
              Next: {countdown}s
            </Chip>
          </div>
        </div>

        {dataUpdatedAt && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Chip size="sm" color="success" variant="flat">
                ⚡ Live Updates
              </Chip>
              <Chip size="sm" color="primary" variant="flat">
                🔄 30s Refresh
              </Chip>
            </div>
            <span className="text-sm text-gray-500">
              Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="h-96">
                <CardHeader className="pb-2">
                  <Skeleton className="w-full h-48 rounded-lg" />
                </CardHeader>
                <CardBody className="space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </CardBody>
              </Card>
            ))
          : books?.map((book: Book) => (
              <Card 
                key={book.key} 
                className="h-96 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50"
                isPressable
                onPress={() => handleBookClick(book)}
              >
                <CardHeader className="pb-2">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
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
                          <div className="text-4xl mb-2">📚</div>
                          <span className="text-gray-500 text-sm">No Cover</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardBody className="space-y-2 flex-1">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">
                      {book.title}
                    </h3>
                    
                    {book.author_name && book.author_name.length > 0 && (
                      <p className="text-xs text-gray-600 line-clamp-1">
                        by {book.author_name[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {book.first_publish_year && (
                        <Chip size="sm" variant="flat" color="primary">
                          {book.first_publish_year}
                        </Chip>
                      )}
                      {book.edition_count && book.edition_count > 1 && (
                        <Chip size="sm" variant="flat" color="secondary">
                          {book.edition_count} editions
                        </Chip>
                      )}
                    </div>
                    
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={isLiked(book.key) ? "danger" : "default"}
                      onPress={() => handleLikeClick(book.key)}
                      className={`transition-all duration-200 ${isLiked(book.key) ? 'scale-110' : 'hover:scale-110'}`}
                    >
                      <HeartIcon 
                        className={`w-4 h-4 ${isLiked(book.key) ? 'fill-current text-red-500' : 'text-gray-400'} transition-colors`}
                      />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default PopularBooks;
