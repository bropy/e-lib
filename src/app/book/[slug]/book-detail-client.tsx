'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, Image, Chip, Button, Textarea, Divider } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { openLibraryService, type Book } from '../../services/openlibrary.service';
import { useBookStore, type Comment } from '../../store/book-store';
import { HeartIcon, ArrowLeftIcon } from '../../components/icons';
import { useRouter } from 'next/navigation';
import ContainerComponent from '../../shared/ui/container.component';

interface CommentForm {
  author: string;
  text: string;
}

interface BookDetailClientProps {
  bookKey: string;
}

const BookDetailClient = ({ bookKey }: BookDetailClientProps) => {
  const router = useRouter();
  const { toggleLike, isLiked, addComment, getCommentsForBook } = useBookStore();
  
  const { data: book, isLoading, error, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ['book-detail', bookKey],
    queryFn: () => openLibraryService.getBookByKey(bookKey),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CommentForm>();

  const comments = getCommentsForBook(bookKey);

  const onSubmitComment = (data: CommentForm) => {
    addComment({
      bookKey,
      author: data.author,
      text: data.text,
    });
    reset();
  };

  if (isLoading) {
    return (
      <ContainerComponent className="w-full py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="w-full lg:w-2/3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ContainerComponent>
    );
  }

  if (error || !book) {
    return (
      <ContainerComponent className="w-full py-8">
        <Card className="bg-red-50 border-red-200">
          <CardBody>
            <p className="text-red-600 text-center">Book not found or failed to load.</p>
            <Button 
              color="primary" 
              variant="light" 
              onPress={() => router.back()}
              className="mt-4 mx-auto"
            >
              Go Back
            </Button>
          </CardBody>
        </Card>
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent className="w-full py-8 space-y-8">
      {/* Back Button & Cache Status */}
      <div className="flex items-center justify-between">
        <Button
          variant="light"
          startContent={<ArrowLeftIcon />}
          onPress={() => router.back()}
        >
          Back to Books
        </Button>
        
        <div className="flex items-center gap-2">
          {isFetching && (
            <Chip size="sm" color="warning" variant="flat">
              🔄 Loading...
            </Chip>
          )}
          {dataUpdatedAt && (
            <Chip size="sm" color="primary" variant="flat">
              💾 Client Cached
            </Chip>
          )}
        </div>
      </div>

      {/* Book Details */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Book Cover */}
        <div className="w-full lg:w-1/3">
          <Card className="h-fit">
            <CardBody className="p-0">
              <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden">
                {book.cover_i ? (
                  <Image
                    src={openLibraryService.getCoverImageUrl(book.cover_i, 'L')}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    fallbackSrc="/placeholder-book.svg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-500">No Cover Available</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Book Info */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <Button
                isIconOnly
                size="lg"
                variant="light"
                color={isLiked(bookKey) ? "danger" : "default"}
                onPress={() => toggleLike(bookKey)}
              >
                <HeartIcon 
                  className={`w-6 h-6 ${isLiked(bookKey) ? 'fill-current' : ''}`}
                />
              </Button>
            </div>

            {book.author_name && book.author_name.length > 0 && (
              <p className="text-xl text-gray-600">
                by {book.author_name.join(', ')}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {book.first_publish_year && (
                <Chip color="primary" variant="flat">
                  Published: {book.first_publish_year}
                </Chip>
              )}
              {book.edition_count && book.edition_count > 1 && (
                <Chip color="secondary" variant="flat">
                  {book.edition_count} editions
                </Chip>
              )}
            </div>

            {book.subject && book.subject.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Subjects:</h3>
                <div className="flex flex-wrap gap-1">
                  {book.subject.slice(0, 10).map((subject, index) => (
                    <Chip key={index} size="sm" variant="bordered">
                      {subject}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Divider />

      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>

        {/* Add Comment Form */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Leave a Comment</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4">
              <div>
                <input
                  {...register('author', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.author && (
                  <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
                )}
              </div>

              <div>
                <Textarea
                  {...register('text', { 
                    required: 'Comment is required',
                    minLength: { value: 10, message: 'Comment must be at least 10 characters' }
                  })}
                  placeholder="Write your comment about this book..."
                  minRows={3}
                  variant="bordered"
                />
                {errors.text && (
                  <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
                )}
              </div>

              <Button
                type="submit"
                color="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Post Comment
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </CardBody>
            </Card>
          ) : (
            comments.map((comment: Comment) => (
              <Card key={comment.id}>
                <CardBody className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </ContainerComponent>
  );
};

export default BookDetailClient;
