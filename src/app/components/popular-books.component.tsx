'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, Image, Chip, Button } from '@heroui/react';
import { openLibraryService, type Book } from '../shared/services/openlibrary.service';
import { popularBooksQueryOptions } from '../shared/api/book-queries';
import { useBookStore } from '../store/book-store';
import { useRouter } from 'next/navigation';
import { HeartIcon } from 'lucide-react';

const PopularBooks = () => {
  const { data: books } = useQuery(popularBooksQueryOptions());

  const { toggleLike, isLiked } = useBookStore();
  const router = useRouter();

  const handleBookClick = (book: Book) => {
    const slug = `${openLibraryService.createSlugFromKey(book.key)}-${openLibraryService.createSlugFromTitle(book.title)}`;
    router.push(`/book/${slug}`);
  };

  const handleLikeClick = (bookKey: string) => {
    toggleLike(bookKey);
  };

  if (!books) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Popular Books</h2>
        <p className="text-gray-600 mt-2">Discover trending books from our collection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {books.map((book: Book) => (
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
