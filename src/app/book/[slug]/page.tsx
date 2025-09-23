import { type FC } from 'react';
import { notFound } from 'next/navigation';
import { openLibraryService } from '../../services/openlibrary.service';
import BookDetailWrapper from './book-detail-wrapper';

// Enable ISR
export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

interface IProps {
  params: Promise<{ slug: string }>;
}

const BookDetailPage: FC<Readonly<IProps>> = async ({ params }) => {
  const { slug } = await params;
  
  // Extract book key from slug (first part before the title)
  const bookKey = slug.split('-')[0];
  const fullKey = `/works/${bookKey}`;

  try {
    // Fetch book data on the server
    const book = await openLibraryService.getBookByKey(fullKey);
    
    if (!book) {
      notFound();
    }

    return <BookDetailWrapper bookKey={fullKey} initialBook={book} />;
  } catch (error) {
    console.error('Error fetching book:', error);
    notFound();
  }
};

// Generate static params for popular books (optional optimization)
export async function generateStaticParams() {
  try {
    const books = await openLibraryService.getPopularBooks();
    return books.slice(0, 5).map((book) => ({
      slug: `${openLibraryService.createSlugFromKey(book.key)}-${openLibraryService.createSlugFromTitle(book.title)}`,
    }));
  } catch {
    return [];
  }
}

export default BookDetailPage;
