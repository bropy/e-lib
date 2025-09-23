import { type FC } from 'react';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '../../shared/utils/query-client';
import { bookDetailQueryOptions } from '../../shared/api/book-queries';
import BookDetailClient from './elements/book-detail-client';

export const dynamic = 'force-static';
export const revalidate = 86400;

interface IProps {
  params: Promise<{ slug: string }>;
}

const BookDetailPage: FC<Readonly<IProps>> = async ({ params }) => {
  const { slug } = await params;
  
  const bookKey = slug.split('-')[0];
  const fullKey = `/works/${bookKey}`;

  try {
    const queryClient = getQueryClient();
    
    await queryClient.prefetchQuery(bookDetailQueryOptions(fullKey));
    const book = queryClient.getQueryData(bookDetailQueryOptions(fullKey).queryKey);
    
    if (!book) {
      notFound();
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookDetailClient bookKey={fullKey} />
      </HydrationBoundary>
    );
  } catch {
    notFound();
  }
};
export default BookDetailPage;